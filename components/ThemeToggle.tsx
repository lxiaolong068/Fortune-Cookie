"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  themeManager,
  type Theme,
  type ThemeConfig,
} from "@/lib/theme-manager";
import { captureUserAction } from "@/lib/error-monitoring";

interface ThemeToggleProps {
  variant?: "button" | "dropdown" | "compact";
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  variant = "dropdown",
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    theme: "system",
    systemPreference: "light",
    effectiveTheme: "light",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 监听主题变化
    const unsubscribe = themeManager.addListener((config) => {
      setThemeConfig(config);
    });

    return unsubscribe;
  }, []);

  // 防止服务端渲染不匹配
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={className} disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const handleThemeChange = (theme: Theme) => {
    themeManager.setTheme(theme);
    captureUserAction("theme_toggle_used", "theme_toggle", undefined, {
      newTheme: theme,
      variant,
    });
  };

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeName = (theme: Theme) => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "Light";
    }
  };

  const getCurrentIcon = () => {
    return getThemeIcon(themeConfig.effectiveTheme);
  };

  // 简单按钮模式
  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => themeManager.toggleTheme()}
        className={className}
        title={`Current: ${getThemeName(themeConfig.theme)}`}
      >
        {getCurrentIcon()}
        {showLabel && (
          <span className="ml-2 hidden sm:inline">
            {getThemeName(themeConfig.theme)}
          </span>
        )}
      </Button>
    );
  }

  // 紧凑模式
  if (variant === "compact") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => themeManager.cycleTheme()}
        className={`${className} flex items-center gap-2`}
        title={`Current: ${getThemeName(themeConfig.theme)}`}
      >
        {getCurrentIcon()}
        {showLabel && (
          <span className="text-xs">{getThemeName(themeConfig.theme)}</span>
        )}
      </Button>
    );
  }

  // 下拉菜单模式（默认）
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          {getCurrentIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Light
          </div>
          {themeConfig.theme === "light" && (
            <Badge variant="secondary" className="text-xs">
              Current
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Dark
          </div>
          {themeConfig.theme === "dark" && (
            <Badge variant="secondary" className="text-xs">
              Current
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            System
          </div>
          {themeConfig.theme === "system" && (
            <Badge variant="secondary" className="text-xs">
              Current
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>System preference:</span>
            <div className="flex items-center gap-1">
              {getThemeIcon(themeConfig.systemPreference)}
              <span>{getThemeName(themeConfig.systemPreference)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Currently showing:</span>
            <div className="flex items-center gap-1">
              {getThemeIcon(themeConfig.effectiveTheme)}
              <span>{getThemeName(themeConfig.effectiveTheme)}</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 主题状态指示器
export function ThemeIndicator({ className }: { className?: string }) {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    theme: "system",
    systemPreference: "light",
    effectiveTheme: "light",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const unsubscribe = themeManager.addListener((config) => {
      setThemeConfig(config);
    });

    return unsubscribe;
  }, []);

  if (!mounted) {
    return null;
  }

  const getThemeIcon = (theme: "light" | "dark") => {
    return theme === "light" ? (
      <Sun className="h-3 w-3" />
    ) : (
      <Moon className="h-3 w-3" />
    );
  };

  return (
    <div
      className={`flex items-center gap-1 text-xs text-muted-foreground ${className}`}
    >
      {getThemeIcon(themeConfig.effectiveTheme)}
      <span>
        {themeConfig.theme === "system"
          ? "System"
          : themeConfig.effectiveTheme === "light"
            ? "Light"
            : "Dark"}
      </span>
    </div>
  );
}

// 主题预览组件
export function ThemePreview() {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    theme: "system",
    systemPreference: "light",
    effectiveTheme: "light",
  });

  useEffect(() => {
    const unsubscribe = themeManager.addListener((config) => {
      setThemeConfig(config);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      {(["light", "dark", "system"] as Theme[]).map((theme) => (
        <button
          key={theme}
          onClick={() => themeManager.setTheme(theme)}
          className={`
            relative p-3 rounded-lg border-2 transition-all
            ${
              themeConfig.theme === theme
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }
          `}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getThemeIcon(theme)}
              <span className="text-sm font-medium">{getThemeName(theme)}</span>
            </div>

            {/* 主题预览色块 */}
            <div className="grid grid-cols-4 gap-1 h-6">
              <div
                className={`rounded ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
              />
              <div
                className={`rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
              />
              <div
                className={`rounded ${theme === "dark" ? "bg-blue-600" : "bg-blue-500"}`}
              />
              <div
                className={`rounded ${theme === "dark" ? "bg-orange-600" : "bg-orange-500"}`}
              />
            </div>
          </div>

          {themeConfig.theme === theme && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
            </div>
          )}
        </button>
      ))}
    </div>
  );

  function getThemeIcon(theme: Theme) {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
    }
  }

  function getThemeName(theme: Theme) {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
    }
  }
}
