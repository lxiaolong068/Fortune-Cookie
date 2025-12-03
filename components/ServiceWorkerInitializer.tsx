"use client";

import { useEffect, useState } from "react";
import { X, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { swManager, offlineDetector } from "@/lib/service-worker";
import {
  captureUserAction,
  captureBusinessEvent,
} from "@/lib/error-monitoring";

export function ServiceWorkerInitializer() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 仅在生产环境注册 Service Worker
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // 注册 Service Worker
    swManager.register().then((registered) => {
      if (registered) {
        captureBusinessEvent("sw_registered", {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        });
      }
    });

    // 监听更新可用事件
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
      captureUserAction("sw_update_detected", "service_worker");
    };

    // 监听安装完成事件
    const handleInstalled = () => {
      captureBusinessEvent("sw_installed", {
        timestamp: new Date().toISOString(),
      });
    };

    swManager.on("updateavailable", handleUpdateAvailable);
    swManager.on("installed", handleInstalled);

    // 监听离线状态变化
    const unsubscribeOffline = offlineDetector.subscribe((offline) => {
      if (offline && !showOfflineNotice && !dismissed) {
        setShowOfflineNotice(true);
        captureUserAction("offline_detected", "network_status");
      } else if (!offline && showOfflineNotice) {
        setShowOfflineNotice(false);
        captureUserAction("online_detected", "network_status");
      }
    });

    // 预取关键内容
    const prefetchContent = async () => {
      const criticalUrls = [
        "/generator",
        "/messages",
        "/api/fortunes?action=popular&limit=10",
      ];

      try {
        await swManager.prefetchContent(criticalUrls);
        captureBusinessEvent("sw_content_prefetched", {
          urls: criticalUrls,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to prefetch content:", error);
      }
    };

    // 延迟预取以避免影响初始加载
    setTimeout(prefetchContent, 3000);

    return () => {
      swManager.off("updateavailable", handleUpdateAvailable);
      swManager.off("installed", handleInstalled);
      unsubscribeOffline();
    };
  }, [showOfflineNotice, dismissed]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    captureUserAction("sw_update_initiated", "service_worker");

    try {
      await swManager.activateUpdate();
      captureBusinessEvent("sw_updated", {
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to update Service Worker:", error);
      captureUserAction("sw_update_failed", "service_worker", undefined, {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismissUpdate = () => {
    setUpdateAvailable(false);
    captureUserAction("sw_update_dismissed", "service_worker");
  };

  const handleDismissOffline = () => {
    setShowOfflineNotice(false);
    setDismissed(true);
    captureUserAction("offline_notice_dismissed", "service_worker");
  };

  // 更新通知
  if (updateAvailable) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-blue-900">
                  App Update Available
                </h3>
                <p className="text-xs text-blue-700 mt-1">
                  A new version is available. Click to update for the latest
                  features and fixes.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="text-xs h-7"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Now"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismissUpdate}
                    className="text-xs h-7"
                  >
                    Later
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismissUpdate}
                className="flex-shrink-0 h-6 w-6 p-0"
                aria-label="关闭更新通知"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 离线通知
  if (showOfflineNotice) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mt-2" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-orange-900">
                  离线模式
                </h3>
                <p className="text-xs text-orange-700 mt-1">
                  您当前处于离线状态。您仍可以浏览缓存的内容。
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismissOffline}
                  className="text-xs h-7 mt-2 p-0"
                >
                  知道了
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismissOffline}
                className="flex-shrink-0 h-6 w-6 p-0"
                aria-label="关闭离线通知"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
