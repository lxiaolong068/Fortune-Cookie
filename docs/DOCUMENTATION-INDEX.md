# 📚 文档索引（精简版）

本目录已清理冗余内容，仅保留对开发与运维必需的文档。通用使用、安装与部署请参考仓库根目录的主文档。

## 主要入口
- 项目指南：../README.md（中文） / ../README-EN.md（英文）
- 贡献与协作：../AGENTS.md
- 环境变量示例：../.env.example

## 必需文档（当前保留）
- API 签名与权限：./API_SIGNATURE.md
- 数据库与 Prisma：./DATABASE_SETUP.md
- 分析与埋点：./ANALYTICS.md
- Sentry 错误监控：./SENTRY_SETUP.md
- Service Worker 离线支持：./SERVICE_WORKER.md
- 测试规范与运行：./TESTING.md
- 安全基线与建议：./SECURITY.md
 - 会话与偏好管理：./SESSION_MANAGEMENT.md

以上文档覆盖本项目的关键运维与开发主题，其余指南已合并或由主文档承担。

## 更新原则
- 保持简洁：避免重复与过时内容。
- 紧贴代码：以仓库中的脚本与配置为准（如 package.json、next.config.js、prisma/schema.prisma）。
- 变更即更新：涉及配置与接口变动时同步修订相关文档。
