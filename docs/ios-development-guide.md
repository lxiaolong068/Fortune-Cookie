# Fortune Cookie AI - iOS 应用开发指南

> 完整的原生 iOS 应用开发文档，面向独立开发者
> 
> 版本：1.0 | 最后更新：2025年1月

---

## 目录

1. [项目架构与技术选型](#第-1-章项目架构与技术选型)
2. [开发环境配置](#第-2-章开发环境配置)
3. [后端 API 集成](#第-3-章后端-api-集成)
4. [核心功能实现](#第-4-章核心功能实现)
5. [UI/UX 设计规范](#第-5-章uiux-设计规范)
6. [数据同步与缓存](#第-6-章数据同步与缓存)
7. [测试策略](#第-7-章测试策略)
8. [部署与上架](#第-8-章部署与上架)
9. [开发时间规划](#第-9-章开发时间规划)

---

## 第 1 章：项目架构与技术选型

### 1.1 项目概述

Fortune Cookie AI iOS 应用是网站 [fortunecookieai.com](https://fortunecookieai.com) 的原生移动端版本。应用通过调用现有的 REST API 实现以下核心功能：

- **AI 幸运饼干生成**：基于 OpenRouter API 的智能生成
- **500+ 消息浏览**：按分类、标签、热度浏览预置消息
- **用户认证**：Google OAuth 登录
- **收藏管理**：保存喜爱的幸运消息
- **离线支持**：本地缓存已浏览的消息

### 1.2 平台要求

| 要求 | 规格 |
|------|------|
| 最低 iOS 版本 | iOS 15.0+ |
| Swift 版本 | Swift 5.7+ |
| Xcode 版本 | Xcode 14.0+ |
| 架构模式 | MVVM (Model-View-ViewModel) |
| UI 框架 | SwiftUI |
| 响应式框架 | Combine |

### 1.3 技术栈选型

#### 核心依赖

```swift
// Package.swift 或通过 Xcode SPM 添加
dependencies: [
    // 网络请求
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),
    
    // Google 登录
    .package(url: "https://github.com/google/GoogleSignIn-iOS.git", from: "7.0.0"),
    
    // 安全存储
    .package(url: "https://github.com/kishikawakatsumi/KeychainAccess.git", from: "4.2.2"),
    
    // Lottie 动画（可选，用于复杂动画）
    .package(url: "https://github.com/airbnb/lottie-ios.git", from: "4.3.0"),
]
```

#### 技术选型理由

| 决策 | 理由 |
|------|------|
| **MVVM 而非 MVC** | 更好的关注点分离，便于单元测试，与 SwiftUI 响应式特性契合 |
| **Combine 而非 RxSwift** | Apple 原生框架，更好的 Swift 集成，无需外部依赖 |
| **Core Data 而非 Realm** | Apple 原生方案，与 SwiftUI 的 `@FetchRequest` 深度集成 |
| **Alamofire 而非原生 URLSession** | 更简洁的 API，内置重试逻辑，更好的错误处理 |
| **Keychain 存储 Token** | 安全存储认证凭证，应用重装后仍可保留 |

### 1.4 项目目录结构

```
FortuneCookieAI/
├── App/
│   ├── FortuneCookieAIApp.swift          # 应用入口
│   ├── AppDelegate.swift                  # Google Sign-In 配置
│   └── ContentView.swift                  # 根视图
│
├── Core/
│   ├── Network/
│   │   ├── APIClient.swift                # 基础网络层
│   │   ├── FortuneAPI.swift               # 幸运饼干 API
│   │   ├── AuthAPI.swift                  # 认证 API
│   │   ├── Endpoints.swift                # API 端点定义
│   │   └── NetworkMonitor.swift           # 网络状态监控
│   │
│   ├── Models/
│   │   ├── Fortune.swift                  # 幸运消息模型
│   │   ├── FortuneMessage.swift           # 数据库消息模型
│   │   ├── QuotaStatus.swift              # 配额状态模型
│   │   ├── User.swift                     # 用户模型
│   │   └── APIResponse.swift              # API 响应包装
│   │
│   ├── Services/
│   │   ├── AuthService.swift              # 认证服务
│   │   ├── FortuneService.swift           # 幸运饼干服务
│   │   ├── CacheService.swift             # 缓存服务
│   │   └── SyncService.swift              # 同步服务
│   │
│   └── Persistence/
│       ├── CoreDataStack.swift            # Core Data 配置
│       ├── FortuneCookieAI.xcdatamodeld   # 数据模型
│       └── PersistenceController.swift    # 持久化控制器
│
├── Features/
│   ├── Home/
│   │   ├── HomeView.swift                 # 主页视图
│   │   ├── HomeViewModel.swift            # 主页 ViewModel
│   │   └── Components/
│   │       ├── FortuneCookieView.swift    # 饼干动画组件
│   │       ├── ThemeSelectorView.swift    # 主题选择器
│   │       ├── LuckyNumbersView.swift     # 幸运数字显示
│   │       └── CustomPromptView.swift     # 自定义提示输入
│   │
│   ├── Browse/
│   │   ├── BrowseView.swift               # 浏览视图
│   │   ├── BrowseViewModel.swift          # 浏览 ViewModel
│   │   └── Components/
│   │       ├── FortuneCardView.swift      # 消息卡片
│   │       ├── CategoryFilterView.swift   # 分类筛选
│   │       └── SearchBarView.swift        # 搜索栏
│   │
│   ├── Favorites/
│   │   ├── FavoritesView.swift            # 收藏视图
│   │   ├── FavoritesViewModel.swift       # 收藏 ViewModel
│   │   └── Components/
│   │       └── FavoriteCardView.swift     # 收藏卡片
│   │
│   ├── Profile/
│   │   ├── ProfileView.swift              # 个人中心
│   │   ├── ProfileViewModel.swift         # 个人中心 ViewModel
│   │   └── Components/
│   │       ├── QuotaDisplayView.swift     # 配额显示
│   │       ├── SignInButtonView.swift     # 登录按钮
│   │       └── UserAvatarView.swift       # 用户头像
│   │
│   └── Settings/
│       ├── SettingsView.swift             # 设置视图
│       └── SettingsViewModel.swift        # 设置 ViewModel
│
├── Shared/
│   ├── Extensions/
│   │   ├── Color+Theme.swift              # 颜色扩展
│   │   ├── View+Animation.swift           # 动画扩展
│   │   ├── Date+Formatting.swift          # 日期扩展
│   │   └── String+Localization.swift      # 本地化扩展
│   │
│   ├── Components/
│   │   ├── LoadingView.swift              # 加载指示器
│   │   ├── ErrorView.swift                # 错误视图
│   │   ├── ToastView.swift                # Toast 提示
│   │   └── EmptyStateView.swift           # 空状态视图
│   │
│   └── Utilities/
│       ├── HapticManager.swift            # 触觉反馈
│       ├── ClientIdentifier.swift         # 客户端标识
│       ├── Constants.swift                # 常量定义
│       └── Logger.swift                   # 日志工具
│
└── Resources/
    ├── Assets.xcassets/                   # 图片资源
    │   ├── AppIcon.appiconset/
    │   ├── Colors/
    │   └── Images/
    ├── Localizable.strings                # 本地化字符串
    ├── Localizable.stringsdict            # 复数规则
    └── Fonts/                             # 自定义字体（可选）
```

### 1.5 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                           View Layer                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ HomeView │ │BrowseView│ │Favorites │ │ Profile  │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       │            │            │            │                   │
│       ▼            ▼            ▼            ▼                   │
├─────────────────────────────────────────────────────────────────┤
│                        ViewModel Layer                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ HomeVM   │ │ BrowseVM │ │FavoritesVM│ │ProfileVM │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       │            │            │            │                   │
│       ▼            ▼            ▼            ▼                   │
├─────────────────────────────────────────────────────────────────┤
│                        Service Layer                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │ FortuneService │  │  AuthService   │  │  CacheService  │    │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘    │
│          │                   │                   │               │
│          ▼                   ▼                   ▼               │
├─────────────────────────────────────────────────────────────────┤
│                         Data Layer                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │   APIClient    │  │   Core Data    │  │    Keychain    │    │
│  │  (Alamofire)   │  │   (SQLite)     │  │   (Security)   │    │
│  └───────┬────────┘  └────────────────┘  └────────────────┘    │
│          │                                                       │
│          ▼                                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Fortune Cookie AI Backend                      │ │
│  │         https://fortunecookieai.com/api/*                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 第 2 章：开发环境配置

### 2.1 前置条件

#### 安装必要工具

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 SwiftLint（代码规范检查）
brew install swiftlint

# 安装 SwiftFormat（代码格式化）
brew install swiftformat
```

### 2.2 创建 Xcode 项目

1. **打开 Xcode** → File → New → Project
2. **选择模板**：iOS → App
3. **配置项目**：
   - Product Name: `FortuneCookieAI`
   - Team: 选择你的开发者账号
   - Organization Identifier: `com.yourname`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Storage: **Core Data** ✓
   - Include Tests: ✓

4. **设置部署目标**：
   - 项目设置 → General → Minimum Deployments → iOS 15.0

### 2.3 添加 Swift Package 依赖

在 Xcode 中：File → Add Package Dependencies

逐一添加以下包：

| 包名 | URL | 版本 |
|------|-----|------|
| Alamofire | `https://github.com/Alamofire/Alamofire.git` | 5.8.0+ |
| GoogleSignIn | `https://github.com/google/GoogleSignIn-iOS.git` | 7.0.0+ |
| KeychainAccess | `https://github.com/kishikawakatsumi/KeychainAccess.git` | 4.2.2+ |

### 2.4 Google OAuth 配置

#### 步骤 1：创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用 **Google Sign-In API**

#### 步骤 2：创建 OAuth 客户端 ID

1. 导航至：APIs & Services → Credentials
2. 点击 "Create Credentials" → "OAuth client ID"
3. 选择 "iOS" 应用类型
4. 填写 Bundle ID：`com.yourname.FortuneCookieAI`
5. 下载配置文件（可选）
6. 记录 **Client ID**

#### 步骤 3：配置 Info.plist

```xml
<!-- Info.plist -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <!-- 将 YOUR_CLIENT_ID 替换为实际的 Client ID（反转格式） -->
            <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
        </array>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
    </dict>
</array>

<key>GIDClientID</key>
<string>YOUR_CLIENT_ID.apps.googleusercontent.com</string>
```

#### 步骤 4：配置 AppDelegate

```swift
// AppDelegate.swift
import UIKit
import GoogleSignIn

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        return true
    }
    
    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        return GIDSignIn.sharedInstance.handle(url)
    }
}

// FortuneCookieAIApp.swift
import SwiftUI

@main
struct FortuneCookieAIApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### 2.5 环境配置管理

创建不同环境的配置文件：

```swift
// Configuration.swift
import Foundation

enum Environment: String {
    case development
    case staging
    case production
    
    static var current: Environment {
        #if DEBUG
        return .development
        #else
        return .production
        #endif
    }
    
    var baseURL: String {
        switch self {
        case .development:
            return "http://localhost:3000"
        case .staging:
            return "https://staging.fortunecookieai.com"
        case .production:
            return "https://fortunecookieai.com"
        }
    }
    
    var googleClientID: String {
        // 从 Info.plist 读取或硬编码
        switch self {
        case .development, .staging:
            return "YOUR_DEV_CLIENT_ID.apps.googleusercontent.com"
        case .production:
            return "YOUR_PROD_CLIENT_ID.apps.googleusercontent.com"
        }
    }
}
```

### 2.6 SwiftLint 配置

在项目根目录创建 `.swiftlint.yml`：

```yaml
# .swiftlint.yml
disabled_rules:
  - trailing_whitespace
  - line_length

opt_in_rules:
  - empty_count
  - closure_spacing
  - contains_over_first_not_nil
  - discouraged_optional_boolean
  - empty_string
  - modifier_order
  - override_in_extension
  - pattern_matching_keywords
  - sorted_first_last
  - toggle_bool
  - unavailable_function
  - unneeded_parentheses_in_closure_argument
  - vertical_parameter_alignment_on_call

excluded:
  - Pods
  - .build
  - DerivedData

line_length:
  warning: 120
  error: 150

type_body_length:
  warning: 300
  error: 400

file_length:
  warning: 500
  error: 800

identifier_name:
  min_length: 2
  max_length: 50
```

在 Build Phases 中添加 Run Script：

```bash
if which swiftlint > /dev/null; then
  swiftlint
else
  echo "warning: SwiftLint not installed"
fi
```

---

## 第 3 章：后端 API 集成

### 3.1 API 端点概览

Fortune Cookie AI 后端提供以下主要 API 端点：

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/fortune` | POST | AI 生成幸运消息 |
| `/api/fortune` | GET | 健康检查 |
| `/api/fortune/quota` | GET | 获取配额状态 |
| `/api/fortunes` | GET | 浏览/搜索消息库 |
| `/api/favorites` | GET/POST/DELETE | 管理收藏 |
| `/api/auth/mobile/google` | POST | 移动端 Google 认证 ⚠️ |

> ⚠️ **注意**：`/api/auth/mobile/google` 端点需要在后端新增开发，详见 [3.7 认证流程](#37-认证流程)。

### 3.2 基础网络层

#### Endpoints.swift

```swift
// Core/Network/Endpoints.swift
import Foundation

enum APIEndpoint {
    static var baseURL: String {
        Environment.current.baseURL
    }
    
    enum Fortune {
        static let generate = "/api/fortune"
        static let quota = "/api/fortune/quota"
        static let browse = "/api/fortunes"
    }
    
    enum Auth {
        static let mobileGoogle = "/api/auth/mobile/google"
        static let session = "/api/auth/session"
    }
    
    enum Favorites {
        static let base = "/api/favorites"
    }
}
```

#### APIClient.swift

```swift
// Core/Network/APIClient.swift
import Foundation
import Alamofire

actor APIClient {
    static let shared = APIClient()
    
    private let session: Session
    private let decoder: JSONDecoder
    
    private init() {
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        
        session = Session(configuration: configuration)
        
        decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601
    }
    
    // MARK: - GET 请求
    func get<T: Decodable>(
        endpoint: String,
        parameters: [String: Any]? = nil,
        headers: [String: String]? = nil
    ) async throws -> T {
        let url = APIEndpoint.baseURL + endpoint
        
        var httpHeaders = HTTPHeaders()
        httpHeaders.add(name: "Content-Type", value: "application/json")
        httpHeaders.add(name: "X-Client-Id", value: ClientIdentifier.get())
        
        headers?.forEach { key, value in
            httpHeaders.add(name: key, value: value)
        }
        
        // 添加认证 Token（如果存在）
        if let token = await AuthService.shared.sessionToken {
            httpHeaders.add(name: "Authorization", value: "Bearer \(token)")
        }
        
        let response = await session.request(
            url,
            method: .get,
            parameters: parameters,
            encoding: URLEncoding.default,
            headers: httpHeaders
        )
        .validate(statusCode: 200..<300)
        .serializingDecodable(T.self, decoder: decoder)
        .response
        
        switch response.result {
        case .success(let data):
            return data
        case .failure(let error):
            throw mapError(error, response: response.response)
        }
    }
    
    // MARK: - POST 请求
    func post<T: Decodable, B: Encodable>(
        endpoint: String,
        body: B,
        headers: [String: String]? = nil
    ) async throws -> T {
        let url = APIEndpoint.baseURL + endpoint
        
        var httpHeaders = HTTPHeaders()
        httpHeaders.add(name: "Content-Type", value: "application/json")
        httpHeaders.add(name: "X-Client-Id", value: ClientIdentifier.get())
        
        headers?.forEach { key, value in
            httpHeaders.add(name: key, value: value)
        }
        
        if let token = await AuthService.shared.sessionToken {
            httpHeaders.add(name: "Authorization", value: "Bearer \(token)")
        }
        
        let response = await session.request(
            url,
            method: .post,
            parameters: body,
            encoder: JSONParameterEncoder.default,
            headers: httpHeaders
        )
        .validate(statusCode: 200..<300)
        .serializingDecodable(T.self, decoder: decoder)
        .response
        
        switch response.result {
        case .success(let data):
            return data
        case .failure(let error):
            throw mapError(error, response: response.response)
        }
    }
    
    // MARK: - 错误映射
    private func mapError(_ error: AFError, response: HTTPURLResponse?) -> APIError {
        guard let statusCode = response?.statusCode else {
            return .networkError(underlying: error)
        }
        
        switch statusCode {
        case 401:
            return .unauthorized
        case 429:
            let resetTime = response?.allHeaderFields["X-RateLimit-Reset"] as? String
            let resetDate = resetTime.flatMap { Double($0) }.map { Date(timeIntervalSince1970: $0) }
            return .rateLimitExceeded(resetTime: resetDate)
        default:
            return .httpError(statusCode: statusCode, message: error.localizedDescription)
        }
    }
}
```

#### APIError.swift

```swift
// Core/Network/APIError.swift
import Foundation

enum APIError: LocalizedError {
    case networkError(underlying: Error)
    case httpError(statusCode: Int, message: String?)
    case rateLimitExceeded(resetTime: Date?)
    case quotaExceeded(quota: QuotaStatus)
    case invalidResponse
    case noData(message: String)
    case unauthorized
    case decodingError(underlying: Error)
    
    var errorDescription: String? {
        switch self {
        case .networkError(let error):
            return "网络错误：\(error.localizedDescription)"
        case .httpError(let code, let message):
            return message ?? "HTTP 错误 \(code)"
        case .rateLimitExceeded(let reset):
            if let reset = reset {
                let formatter = DateFormatter()
                formatter.timeStyle = .short
                return "请求过于频繁，请在 \(formatter.string(from: reset)) 后重试"
            }
            return "请求过于频繁，请稍后重试"
        case .quotaExceeded(let quota):
            return quota.isAuthenticated
                ? "今日配额已用完，请明天再来"
                : "游客配额已用完，登录获取更多次数"
        case .invalidResponse:
            return "服务器响应无效"
        case .noData(let message):
            return message
        case .unauthorized:
            return "请先登录"
        case .decodingError(let error):
            return "数据解析错误：\(error.localizedDescription)"
        }
    }
}
```

### 3.3 数据模型

#### Fortune.swift

```swift
// Core/Models/Fortune.swift
import Foundation

/// AI 生成的幸运消息
struct Fortune: Codable, Identifiable, Equatable {
    let id: String?
    let message: String
    let luckyNumbers: [Int]
    let theme: String
    let timestamp: String
    let source: FortuneSource?
    let cached: Bool?
    let aiError: AIError?
    
    enum FortuneSource: String, Codable {
        case ai
        case database
        case fallback
    }
    
    var timestampDate: Date? {
        ISO8601DateFormatter().date(from: timestamp)
    }
}

struct AIError: Codable, Equatable {
    let provider: String
    let status: Int?
    let code: String?
    let message: String
}
```

#### FortuneRequest.swift

```swift
// Core/Models/FortuneRequest.swift
import Foundation

/// 幸运消息生成请求
struct FortuneRequest: Codable {
    let theme: Theme
    let mood: Mood
    let length: Length
    let customPrompt: String?
    let scenario: Scenario?
    let tone: Tone?
    let language: Language
    
    enum Theme: String, Codable, CaseIterable, Identifiable {
        case funny
        case inspirational
        case love
        case success
        case wisdom
        case random
        
        var id: String { rawValue }
        
        var displayName: String {
            switch self {
            case .funny: return "搞笑"
            case .inspirational: return "励志"
            case .love: return "爱情"
            case .success: return "成功"
            case .wisdom: return "智慧"
            case .random: return "随机"
            }
        }
        
        var icon: String {
            switch self {
            case .funny: return "face.smiling"
            case .inspirational: return "sparkles"
            case .love: return "heart.fill"
            case .success: return "chart.line.uptrend.xyaxis"
            case .wisdom: return "brain.head.profile"
            case .random: return "shuffle"
            }
        }
        
        var emoji: String {
            switch self {
            case .funny: return "😊"
            case .inspirational: return "✨"
            case .love: return "❤️"
            case .success: return "📈"
            case .wisdom: return "🧠"
            case .random: return "🔀"
            }
        }
    }
    
    enum Mood: String, Codable {
        case positive
        case neutral
        case motivational
        case humorous
    }
    
    enum Length: String, Codable {
        case short
        case medium
        case long
    }
    
    enum Scenario: String, Codable {
        case work
        case love
        case study
        case health
        case other
    }
    
    enum Tone: String, Codable {
        case soft
        case direct
        case playful
    }
    
    enum Language: String, Codable {
        case en
        case zh
    }
    
    init(
        theme: Theme = .random,
        mood: Mood = .positive,
        length: Length = .medium,
        customPrompt: String? = nil,
        scenario: Scenario? = nil,
        tone: Tone? = nil,
        language: Language = .zh
    ) {
        self.theme = theme
        self.mood = mood
        self.length = length
        self.customPrompt = customPrompt
        self.scenario = scenario
        self.tone = tone
        self.language = language
    }
}
```

#### FortuneMessage.swift

```swift
// Core/Models/FortuneMessage.swift
import Foundation

/// 数据库中的预置消息
struct FortuneMessage: Codable, Identifiable, Equatable {
    let id: String
    let message: String
    let category: Category
    let tags: [String]
    let luckyNumbers: [Int]
    let popularity: Int
    let dateAdded: String
    
    enum Category: String, Codable, CaseIterable, Identifiable {
        case inspirational
        case funny
        case love
        case success
        case wisdom
        case friendship
        case health
        case travel
        case birthday
        case study
        
        var id: String { rawValue }
        
        var displayName: String {
            switch self {
            case .inspirational: return "励志"
            case .funny: return "搞笑"
            case .love: return "爱情"
            case .success: return "成功"
            case .wisdom: return "智慧"
            case .friendship: return "友情"
            case .health: return "健康"
            case .travel: return "旅行"
            case .birthday: return "生日"
            case .study: return "学习"
            }
        }
        
        var icon: String {
            switch self {
            case .inspirational: return "sparkles"
            case .funny: return "face.smiling"
            case .love: return "heart.fill"
            case .success: return "chart.line.uptrend.xyaxis"
            case .wisdom: return "brain.head.profile"
            case .friendship: return "person.2.fill"
            case .health: return "heart.text.square.fill"
            case .travel: return "airplane"
            case .birthday: return "gift.fill"
            case .study: return "book.fill"
            }
        }
    }
}
```

#### QuotaStatus.swift

```swift
// Core/Models/QuotaStatus.swift
import Foundation

/// 每日配额状态
struct QuotaStatus: Codable, Equatable {
    let limit: Int
    let used: Int
    let remaining: Int
    let resetsAtUtc: String
    let isAuthenticated: Bool
    
    var resetsAt: Date? {
        ISO8601DateFormatter().date(from: resetsAtUtc)
    }
    
    var hasQuota: Bool {
        remaining > 0
    }
    
    var usagePercentage: Double {
        guard limit > 0 else { return 0 }
        return Double(used) / Double(limit)
    }
    
    var resetTimeString: String {
        guard let date = resetsAt else { return "未知" }
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .full
        formatter.locale = Locale(identifier: "zh_CN")
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}
```

#### APIResponse.swift

```swift
// Core/Models/APIResponse.swift
import Foundation

/// API 通用响应包装
struct APIResponse<T: Codable>: Codable {
    let success: Bool?
    let data: T?
    let message: String?
    let error: String?
    let meta: ResponseMeta?
}

struct ResponseMeta: Codable {
    let cached: Bool?
    let cacheKey: String?
    let responseTime: Int?
    let source: String?
    let quota: QuotaStatus?
    let pagination: PaginationMeta?
}

struct PaginationMeta: Codable {
    let page: Int
    let limit: Int
    let total: Int
    let totalPages: Int
    let hasNext: Bool
    let hasPrev: Bool
}

/// 浏览列表响应
struct FortuneListResponse: Codable {
    let results: [FortuneMessage]
    let total: Int
    let category: String?
    let sortBy: String?
}
```

### 3.4 Fortune API 服务

```swift
// Core/Network/FortuneAPI.swift
import Foundation

actor FortuneAPI {
    private let client: APIClient
    
    init(client: APIClient = .shared) {
        self.client = client
    }
    
    // MARK: - 生成幸运消息
    func generateFortune(request: FortuneRequest) async throws -> Fortune {
        let response: APIResponse<Fortune> = try await client.post(
            endpoint: APIEndpoint.Fortune.generate,
            body: request
        )
        
        // 检查配额
        if let quota = response.meta?.quota, quota.remaining <= 0 {
            throw APIError.quotaExceeded(quota: quota)
        }
        
        guard let fortune = response.data else {
            throw APIError.noData(message: response.error ?? response.message ?? "生成失败")
        }
        
        return fortune
    }
    
    // MARK: - 获取配额状态
    func getQuotaStatus() async throws -> QuotaStatus {
        let response: APIResponse<QuotaStatus> = try await client.get(
            endpoint: APIEndpoint.Fortune.quota
        )
        
        guard let quota = response.data else {
            throw APIError.noData(message: "无法获取配额信息")
        }
        
        return quota
    }
    
    // MARK: - 浏览消息
    enum BrowseAction: String {
        case list
        case search
        case category
        case popular
        case random
        case stats
        case get
    }
    
    func browseFortunes(
        action: BrowseAction = .list,
        query: String? = nil,
        category: String? = nil,
        page: Int = 1,
        limit: Int = 20,
        sort: String? = nil,
        count: Int? = nil,
        id: String? = nil
    ) async throws -> (results: [FortuneMessage], pagination: PaginationMeta?) {
        var parameters: [String: Any] = [
            "action": action.rawValue,
            "page": page,
            "limit": min(limit, 100)
        ]
        
        if let query = query { parameters["q"] = query }
        if let category = category { parameters["category"] = category }
        if let sort = sort { parameters["sort"] = sort }
        if let count = count { parameters["count"] = count }
        if let id = id { parameters["id"] = id }
        
        let response: APIResponse<FortuneListResponse> = try await client.get(
            endpoint: APIEndpoint.Fortune.browse,
            parameters: parameters
        )
        
        guard let data = response.data else {
            throw APIError.noData(message: "无法获取消息列表")
        }
        
        return (data.results, response.meta?.pagination)
    }
    
    // MARK: - 获取随机消息
    func getRandomFortunes(count: Int = 5) async throws -> [FortuneMessage] {
        let (results, _) = try await browseFortunes(
            action: .random,
            count: min(count, 10)
        )
        return results
    }
    
    // MARK: - 搜索消息
    func searchFortunes(
        query: String,
        category: String? = nil,
        page: Int = 1,
        limit: Int = 20
    ) async throws -> (results: [FortuneMessage], pagination: PaginationMeta?) {
        return try await browseFortunes(
            action: .search,
            query: query,
            category: category,
            page: page,
            limit: limit
        )
    }
    
    // MARK: - 按分类浏览
    func getFortunesByCategory(
        category: FortuneMessage.Category,
        page: Int = 1,
        limit: Int = 20,
        sort: String = "popularity"
    ) async throws -> (results: [FortuneMessage], pagination: PaginationMeta?) {
        return try await browseFortunes(
            action: .category,
            category: category.rawValue,
            page: page,
            limit: limit,
            sort: sort
        )
    }
    
    // MARK: - 获取热门消息
    func getPopularFortunes(limit: Int = 20) async throws -> [FortuneMessage] {
        let (results, _) = try await browseFortunes(
            action: .popular,
            limit: limit
        )
        return results
    }
}
```

### 3.5 客户端标识

```swift
// Shared/Utilities/ClientIdentifier.swift
import Foundation
import KeychainAccess

/// 客户端标识管理器
/// 用于游客用户的配额追踪
enum ClientIdentifier {
    private static let keychain = Keychain(service: "com.fortunecookieai.client")
    private static let key = "client_id"
    
    /// 获取或创建客户端 ID
    static func get() -> String {
        // 尝试从 Keychain 读取
        if let existingID = try? keychain.get(key) {
            return existingID
        }
        
        // 创建新的 UUID
        let newID = UUID().uuidString
        try? keychain.set(newID, key: key)
        return newID
    }
    
    /// 重置客户端 ID（通常不需要）
    static func reset() {
        try? keychain.remove(key)
    }
}
```

### 3.6 网络状态监控

```swift
// Core/Network/NetworkMonitor.swift
import Foundation
import Network

@MainActor
class NetworkMonitor: ObservableObject {
    static let shared = NetworkMonitor()
    
    @Published var isConnected: Bool = true
    @Published var connectionType: ConnectionType = .unknown
    
    enum ConnectionType {
        case wifi
        case cellular
        case ethernet
        case unknown
    }
    
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")
    
    private init() {
        startMonitoring()
    }
    
    func startMonitoring() {
        monitor.pathUpdateHandler = { [weak self] path in
            Task { @MainActor in
                self?.isConnected = path.status == .satisfied
                self?.connectionType = self?.getConnectionType(path) ?? .unknown
            }
        }
        monitor.start(queue: queue)
    }
    
    func stopMonitoring() {
        monitor.cancel()
    }
    
    private func getConnectionType(_ path: NWPath) -> ConnectionType {
        if path.usesInterfaceType(.wifi) {
            return .wifi
        } else if path.usesInterfaceType(.cellular) {
            return .cellular
        } else if path.usesInterfaceType(.wiredEthernet) {
            return .ethernet
        }
        return .unknown
    }
}
```

### 3.7 认证流程

> ⚠️ **重要提示**：当前后端使用 NextAuth.js 的 Web OAuth 流程。为支持 iOS 原生 Google 登录，需要在后端新增 `/api/auth/mobile/google` 端点。

#### 后端新增端点设计（供参考）

```typescript
// 后端需要新增的端点：app/api/auth/mobile/google/route.ts
import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  const { idToken, deviceId } = await request.json();
  
  // 验证 Google ID Token
  const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_IOS_CLIENT_ID, // iOS 专用 Client ID
  });
  
  const payload = ticket.getPayload();
  if (!payload) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  // 查找或创建用户
  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        image: payload.picture,
      },
    });
  }
  
  // 创建会话 Token
  const sessionToken = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 天
  
  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  });
  
  return Response.json({
    sessionToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    expiresAt: expires.toISOString(),
  });
}
```

#### iOS 认证服务

```swift
// Core/Services/AuthService.swift
import Foundation
import GoogleSignIn
import KeychainAccess

@MainActor
class AuthService: ObservableObject {
    static let shared = AuthService()
    
    @Published var currentUser: User?
    @Published var isAuthenticated: Bool = false
    @Published var isLoading: Bool = false
    
    private let keychain = Keychain(service: "com.fortunecookieai.auth")
    private let sessionTokenKey = "session_token"
    private let userKey = "current_user"
    
    var sessionToken: String? {
        try? keychain.get(sessionTokenKey)
    }
    
    private init() {
        loadStoredSession()
    }
    
    // MARK: - 加载已存储的会话
    private func loadStoredSession() {
        guard let token = try? keychain.get(sessionTokenKey),
              let userData = try? keychain.getData(userKey),
              let user = try? JSONDecoder().decode(User.self, from: userData) else {
            return
        }
        
        self.currentUser = user
        self.isAuthenticated = true
    }
    
    // MARK: - Google 登录
    func signInWithGoogle() async throws {
        isLoading = true
        defer { isLoading = false }
        
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootViewController = windowScene.windows.first?.rootViewController else {
            throw AuthError.noRootViewController
        }
        
        // 执行 Google 登录
        let result = try await GIDSignIn.sharedInstance.signIn(
            withPresenting: rootViewController
        )
        
        guard let idToken = result.user.idToken?.tokenString else {
            throw AuthError.noIdToken
        }
        
        // 发送到后端验证
        try await verifyWithBackend(idToken: idToken)
    }
    
    // MARK: - 后端验证
    private func verifyWithBackend(idToken: String) async throws {
        struct AuthRequest: Codable {
            let idToken: String
            let deviceId: String
        }
        
        struct AuthResponse: Codable {
            let sessionToken: String
            let user: User
            let expiresAt: String
        }
        
        let request = AuthRequest(
            idToken: idToken,
            deviceId: ClientIdentifier.get()
        )
        
        let response: AuthResponse = try await APIClient.shared.post(
            endpoint: APIEndpoint.Auth.mobileGoogle,
            body: request
        )
        
        // 存储会话
        try keychain.set(response.sessionToken, key: sessionTokenKey)
        
        let userData = try JSONEncoder().encode(response.user)
        try keychain.set(userData, key: userKey)
        
        self.currentUser = response.user
        self.isAuthenticated = true
    }
    
    // MARK: - 登出
    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        
        try? keychain.remove(sessionTokenKey)
        try? keychain.remove(userKey)
        
        currentUser = nil
        isAuthenticated = false
    }
    
    // MARK: - 检查会话有效性
    func validateSession() async -> Bool {
        guard sessionToken != nil else { return false }
        
        do {
            // 调用需要认证的端点验证 Token
            let _: QuotaStatus = try await APIClient.shared.get(
                endpoint: APIEndpoint.Fortune.quota
            )
            return true
        } catch {
            // Token 无效，清除会话
            signOut()
            return false
        }
    }
}

// MARK: - User Model
struct User: Codable, Identifiable, Equatable {
    let id: String
    let name: String?
    let email: String?
    let image: String?
}

// MARK: - Auth Errors
enum AuthError: LocalizedError {
    case noRootViewController
    case noIdToken
    case backendError(String)
    
    var errorDescription: String? {
        switch self {
        case .noRootViewController:
            return "无法获取应用窗口"
        case .noIdToken:
            return "Google 登录失败"
        case .backendError(let message):
            return message
        }
    }
}
```

### 3.8 游客模式（无需后端改动）

如果暂时不实现后端认证端点，可以先使用游客模式：

```swift
// Core/Services/GuestModeService.swift
import Foundation

/// 游客模式服务
/// 使用 X-Client-Id 追踪配额，每天 1 次 AI 生成
@MainActor
class GuestModeService: ObservableObject {
    static let shared = GuestModeService()
    
    @Published var quotaStatus: QuotaStatus?
    @Published var isLoading: Bool = false
    
    private let fortuneAPI = FortuneAPI()
    
    private init() {}
    
    /// 检查配额
    func checkQuota() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            quotaStatus = try await fortuneAPI.getQuotaStatus()
        } catch {
            print("获取配额失败: \(error)")
        }
    }
    
    /// 是否可以生成
    var canGenerate: Bool {
        quotaStatus?.hasQuota ?? true
    }
    
    /// 配额提示信息
    var quotaMessage: String {
        guard let quota = quotaStatus else {
            return "正在检查配额..."
        }
        
        if quota.hasQuota {
            return "今日剩余 \(quota.remaining)/\(quota.limit) 次"
        } else {
            return "今日配额已用完，\(quota.resetTimeString)重置"
        }
    }
}
```

---

## 第 4 章：核心功能实现

### 4.1 幸运饼干生成

#### FortuneViewModel

```swift
// Features/Home/HomeViewModel.swift
import Foundation
import Combine

@MainActor
class HomeViewModel: ObservableObject {
    // MARK: - Published Properties
    @Published var fortune: Fortune?
    @Published var selectedTheme: FortuneRequest.Theme = .random
    @Published var customPrompt: String = ""
    @Published var cookieState: CookieState = .unopened
    @Published var isGenerating: Bool = false
    @Published var error: String?
    @Published var quotaStatus: QuotaStatus?
    @Published var showSignInPrompt: Bool = false
    
    // MARK: - Cookie States
    enum CookieState: Equatable {
        case unopened
        case cracking
        case opened
    }
    
    // MARK: - Dependencies
    private let fortuneAPI: FortuneAPI
    private let authService: AuthService
    private let cacheService: CacheService
    
    // MARK: - Initialization
    init(
        fortuneAPI: FortuneAPI = FortuneAPI(),
        authService: AuthService = .shared,
        cacheService: CacheService = .shared
    ) {
        self.fortuneAPI = fortuneAPI
        self.authService = authService
        self.cacheService = cacheService
    }
    
    // MARK: - Generate Fortune
    func generateFortune() async {
        // 防止重复点击
        guard cookieState == .unopened, !isGenerating else { return }
        
        // 检查配额
        if let quota = quotaStatus, !quota.hasQuota {
            if quota.isAuthenticated {
                error = "今日配额已用完，请明天再来"
            } else {
                showSignInPrompt = true
            }
            return
        }
        
        isGenerating = true
        cookieState = .cracking
        error = nil
        
        // 触觉反馈
        HapticManager.shared.impact(style: .medium)
        
        do {
            let request = FortuneRequest(
                theme: selectedTheme,
                mood: .positive,
                length: .medium,
                customPrompt: customPrompt.isEmpty ? nil : customPrompt,
                language: .zh
            )
            
            fortune = try await fortuneAPI.generateFortune(request: request)
            
            // 等待饼干裂开动画（2秒）
            try await Task.sleep(nanoseconds: 2_000_000_000)
            
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                cookieState = .opened
            }
            
            // 成功触觉反馈
            HapticManager.shared.notification(type: .success)
            
            // 缓存结果
            if let fortune = fortune {
                await cacheService.cacheFortune(fortune)
            }
            
            // 刷新配额
            await loadQuota()
            
        } catch let apiError as APIError {
            handleError(apiError)
        } catch {
            self.error = error.localizedDescription
            cookieState = .unopened
        }
        
        isGenerating = false
    }
    
    // MARK: - Handle Errors
    private func handleError(_ apiError: APIError) {
        switch apiError {
        case .quotaExceeded(let quota):
            self.quotaStatus = quota
            if !quota.isAuthenticated {
                showSignInPrompt = true
            } else {
                error = "今日配额已用完"
            }
            
        case .rateLimitExceeded:
            // 使用本地回退消息
            useFallbackFortune()
            
        default:
            error = apiError.localizedDescription
            // 尝试使用回退消息
            useFallbackFortune()
        }
    }
    
    // MARK: - Fallback Fortune
    private func useFallbackFortune() {
        fortune = Fortune(
            id: nil,
            message: Self.fallbackMessages.randomElement() ?? "好运即将来临",
            luckyNumbers: (1...6).map { _ in Int.random(in: 1...49) }.sorted(),
            theme: selectedTheme.rawValue,
            timestamp: ISO8601DateFormatter().string(from: Date()),
            source: .fallback,
            cached: false,
            aiError: nil
        )
        
        Task {
            try? await Task.sleep(nanoseconds: 2_000_000_000)
            await MainActor.run {
                withAnimation(.spring()) {
                    cookieState = .opened
                }
            }
        }
    }
    
    private static let fallbackMessages = [
        "最好的幸运是你自己创造的",
        "机会总是留给有准备的人",
        "今天种下的种子，明天会开花",
        "相信自己，你比想象中更强大",
        "每一次尝试都是成功的开始",
    ]
    
    // MARK: - Reset Cookie
    func resetCookie() {
        withAnimation(.spring()) {
            cookieState = .unopened
            fortune = nil
            customPrompt = ""
            error = nil
        }
    }
    
    // MARK: - Load Quota
    func loadQuota() async {
        do {
            quotaStatus = try await fortuneAPI.getQuotaStatus()
        } catch {
            print("获取配额失败: \(error)")
        }
    }
    
    // MARK: - Favorite
    func toggleFavorite() async {
        guard let fortune = fortune else { return }
        
        if await cacheService.isFavorite(fortune) {
            await cacheService.removeFavorite(fortune)
        } else {
            await cacheService.saveFavorite(fortune)
        }
        
        HapticManager.shared.impact(style: .light)
    }
    
    func isFavorite() async -> Bool {
        guard let fortune = fortune else { return false }
        return await cacheService.isFavorite(fortune)
    }
}
```

### 4.2 消息浏览

```swift
// Features/Browse/BrowseViewModel.swift
import Foundation
import Combine

@MainActor
class BrowseViewModel: ObservableObject {
    // MARK: - Published Properties
    @Published var fortunes: [FortuneMessage] = []
    @Published var selectedCategory: FortuneMessage.Category?
    @Published var searchQuery: String = ""
    @Published var sortOption: SortOption = .popularity
    @Published var isLoading: Bool = false
    @Published var isLoadingMore: Bool = false
    @Published var error: String?
    @Published var pagination: PaginationMeta?
    
    // MARK: - Sort Options
    enum SortOption: String, CaseIterable, Identifiable {
        case popularity
        case recent
        case alphabetical
        
        var id: String { rawValue }
        
        var displayName: String {
            switch self {
            case .popularity: return "热门"
            case .recent: return "最新"
            case .alphabetical: return "字母"
            }
        }
    }
    
    // MARK: - Dependencies
    private let fortuneAPI: FortuneAPI
    private let cacheService: CacheService
    private var cancellables = Set<AnyCancellable>()
    
    private var currentPage: Int = 1
    private var canLoadMore: Bool = true
    
    // MARK: - Initialization
    init(fortuneAPI: FortuneAPI = FortuneAPI(), cacheService: CacheService = .shared) {
        self.fortuneAPI = fortuneAPI
        self.cacheService = cacheService
        setupSearchDebounce()
    }
    
    // MARK: - Search Debounce
    private func setupSearchDebounce() {
        $searchQuery
            .debounce(for: .milliseconds(500), scheduler: DispatchQueue.main)
            .removeDuplicates()
            .sink { [weak self] _ in
                Task {
                    await self?.loadFortunes(reset: true)
                }
            }
            .store(in: &cancellables)
    }
    
    // MARK: - Load Fortunes
    func loadFortunes(reset: Bool = false) async {
        if reset {
            currentPage = 1
            canLoadMore = true
            fortunes = []
        }
        
        guard canLoadMore, !isLoading else { return }
        
        isLoading = reset
        isLoadingMore = !reset
        error = nil
        
        do {
            let action: FortuneAPI.BrowseAction = searchQuery.isEmpty ? .list : .search
            
            let (results, paginationMeta) = try await fortuneAPI.browseFortunes(
                action: action,
                query: searchQuery.isEmpty ? nil : searchQuery,
                category: selectedCategory?.rawValue,
                page: currentPage,
                limit: 20,
                sort: sortOption.rawValue
            )
            
            if reset {
                fortunes = results
            } else {
                fortunes.append(contentsOf: results)
            }
            
            pagination = paginationMeta
            canLoadMore = paginationMeta?.hasNext ?? false
            currentPage += 1
            
            // 缓存结果供离线使用
            await cacheService.cacheFortuneMessages(results)
            
        } catch {
            self.error = error.localizedDescription
            
            // 尝试从缓存加载
            if reset {
                let cached = await cacheService.getCachedFortuneMessages(
                    category: selectedCategory?.rawValue
                )
                if !cached.isEmpty {
                    fortunes = cached
                }
            }
        }
        
        isLoading = false
        isLoadingMore = false
    }
    
    // MARK: - Load More
    func loadMoreIfNeeded(currentItem: FortuneMessage) {
        guard let lastItem = fortunes.last,
              currentItem.id == lastItem.id,
              canLoadMore,
              !isLoadingMore else {
            return
        }
        
        Task {
            await loadFortunes(reset: false)
        }
    }
    
    // MARK: - Filter by Category
    func filterByCategory(_ category: FortuneMessage.Category?) {
        selectedCategory = category
        Task {
            await loadFortunes(reset: true)
        }
    }
    
    // MARK: - Change Sort
    func changeSort(_ option: SortOption) {
        sortOption = option
        Task {
            await loadFortunes(reset: true)
        }
    }
    
    // MARK: - Refresh
    func refresh() async {
        await loadFortunes(reset: true)
    }
}
```

### 4.3 收藏管理

```swift
// Features/Favorites/FavoritesViewModel.swift
import Foundation
import Combine

@MainActor
class FavoritesViewModel: ObservableObject {
    // MARK: - Published Properties
    @Published var favorites: [Fortune] = []
    @Published var searchQuery: String = ""
    @Published var selectedCategory: String?
    @Published var sortOption: SortOption = .newest
    @Published var isLoading: Bool = false
    
    // MARK: - Computed Properties
    var filteredFavorites: [Fortune] {
        var result = favorites
        
        // 搜索过滤
        if !searchQuery.isEmpty {
            result = result.filter {
                $0.message.localizedCaseInsensitiveContains(searchQuery)
            }
        }
        
        // 分类过滤
        if let category = selectedCategory {
            result = result.filter { $0.theme == category }
        }
        
        // 排序
        switch sortOption {
        case .newest:
            result.sort { ($0.timestampDate ?? .distantPast) > ($1.timestampDate ?? .distantPast) }
        case .oldest:
            result.sort { ($0.timestampDate ?? .distantPast) < ($1.timestampDate ?? .distantPast) }
        case .alphabetical:
            result.sort { $0.message < $1.message }
        }
        
        return result
    }
    
    var availableCategories: [String] {
        Array(Set(favorites.map { $0.theme })).sorted()
    }
    
    var isEmpty: Bool {
        favorites.isEmpty
    }
    
    var filteredIsEmpty: Bool {
        filteredFavorites.isEmpty && !isEmpty
    }
    
    // MARK: - Sort Options
    enum SortOption: String, CaseIterable, Identifiable {
        case newest
        case oldest
        case alphabetical
        
        var id: String { rawValue }
        
        var displayName: String {
            switch self {
            case .newest: return "最新"
            case .oldest: return "最早"
            case .alphabetical: return "字母"
            }
        }
    }
    
    // MARK: - Dependencies
    private let cacheService: CacheService
    
    // MARK: - Initialization
    init(cacheService: CacheService = .shared) {
        self.cacheService = cacheService
    }
    
    // MARK: - Load Favorites
    func loadFavorites() async {
        isLoading = true
        favorites = await cacheService.getFavorites()
        isLoading = false
    }
    
    // MARK: - Remove Favorite
    func removeFavorite(_ fortune: Fortune) async {
        await cacheService.removeFavorite(fortune)
        await loadFavorites()
        HapticManager.shared.notification(type: .success)
    }
    
    // MARK: - Clear Filters
    func clearFilters() {
        searchQuery = ""
        selectedCategory = nil
    }
}
```

---

## 第 5 章：UI/UX 设计规范

### 5.1 颜色系统

```swift
// Shared/Extensions/Color+Theme.swift
import SwiftUI

extension Color {
    // MARK: - 品牌色
    static let brandOrange = Color(red: 251/255, green: 146/255, blue: 60/255)
    static let brandAmber = Color(red: 245/255, green: 158/255, blue: 11/255)
    
    // MARK: - 主题色
    static let fortuneTheme = FortuneThemeColors()
    
    struct FortuneThemeColors {
        // 搞笑 - 黄色
        let funny = ThemeColor(
            background: Color(red: 254/255, green: 249/255, blue: 195/255),
            foreground: Color(red: 133/255, green: 77/255, blue: 14/255)
        )
        
        // 励志 - 蓝色
        let inspirational = ThemeColor(
            background: Color(red: 219/255, green: 234/255, blue: 254/255),
            foreground: Color(red: 30/255, green: 64/255, blue: 175/255)
        )
        
        // 爱情 - 粉色
        let love = ThemeColor(
            background: Color(red: 252/255, green: 231/255, blue: 243/255),
            foreground: Color(red: 157/255, green: 23/255, blue: 77/255)
        )
        
        // 成功 - 绿色
        let success = ThemeColor(
            background: Color(red: 220/255, green: 252/255, blue: 231/255),
            foreground: Color(red: 22/255, green: 101/255, blue: 52/255)
        )
        
        // 智慧 - 紫色
        let wisdom = ThemeColor(
            background: Color(red: 243/255, green: 232/255, blue: 255/255),
            foreground: Color(red: 107/255, green: 33/255, blue: 168/255)
        )
        
        // 随机 - 灰色
        let random = ThemeColor(
            background: Color(red: 243/255, green: 244/255, blue: 246/255),
            foreground: Color(red: 31/255, green: 41/255, blue: 55/255)
        )
        
        func color(for theme: FortuneRequest.Theme) -> ThemeColor {
            switch theme {
            case .funny: return funny
            case .inspirational: return inspirational
            case .love: return love
            case .success: return success
            case .wisdom: return wisdom
            case .random: return random
            }
        }
    }
    
    struct ThemeColor {
        let background: Color
        let foreground: Color
    }
    
    // MARK: - 语义色
    static let cardBackground = Color(UIColor.systemBackground)
    static let secondaryBackground = Color(UIColor.secondarySystemBackground)
    static let tertiaryBackground = Color(UIColor.tertiarySystemBackground)
}
```

### 5.2 幸运饼干动画组件

```swift
// Features/Home/Components/FortuneCookieView.swift
import SwiftUI

struct FortuneCookieView: View {
    let state: HomeViewModel.CookieState
    let fortune: Fortune?
    let isGenerating: Bool
    let onTap: () -> Void
    
    @State private var rotation: Double = 0
    @State private var scale: CGFloat = 1.0
    @State private var crackOffset: CGFloat = 0
    @State private var particleOpacity: Double = 0
    
    var body: some View {
        ZStack {
            switch state {
            case .unopened:
                unopenedCookie
                
            case .cracking:
                crackingCookie
                
            case .opened:
                openedCookie
            }
        }
        .frame(width: 300, height: 300)
        .contentShape(Rectangle())
        .onTapGesture {
            if state == .unopened {
                onTap()
            }
        }
    }
    
    // MARK: - 未打开状态
    private var unopenedCookie: some View {
        ZStack {
            // 饼干图像
            cookieImage
                .scaleEffect(scale)
                .rotationEffect(.degrees(rotation))
                .onAppear {
                    startIdleAnimation()
                }
            
            // 点击提示
            if !isGenerating {
                VStack {
                    Spacer()
                    Text("点击打开")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.top, 130)
                }
            }
            
            // 加载指示器
            if isGenerating {
                ProgressView()
                    .scaleEffect(1.5)
                    .offset(y: 100)
            }
        }
    }
    
    // MARK: - 裂开状态
    private var crackingCookie: some View {
        ZStack {
            // 左半边
            cookieLeftHalf
                .offset(x: -crackOffset, y: crackOffset / 2)
                .rotationEffect(.degrees(-Double(crackOffset) / 3))
            
            // 右半边
            cookieRightHalf
                .offset(x: crackOffset, y: crackOffset / 2)
                .rotationEffect(.degrees(Double(crackOffset) / 3))
            
            // 粒子效果
            ForEach(0..<8, id: \.self) { index in
                Circle()
                    .fill(Color.brandAmber.opacity(0.6))
                    .frame(width: 8, height: 8)
                    .offset(
                        x: CGFloat.random(in: -80...80) * (crackOffset / 50),
                        y: CGFloat.random(in: -80...80) * (crackOffset / 50)
                    )
                    .opacity(particleOpacity)
            }
            
            // 加载文字
            Text("正在生成...")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .offset(y: 100)
        }
        .onAppear {
            startCrackAnimation()
        }
    }
    
    // MARK: - 打开状态
    private var openedCookie: some View {
        VStack(spacing: 20) {
            // 消息卡片
            if let fortune = fortune {
                FortuneMessageCard(fortune: fortune)
                    .transition(.scale.combined(with: .opacity))
            }
            
            // 饼干碎片装饰
            cookieCrumbs
                .opacity(0.8)
        }
    }
    
    // MARK: - Cookie Images
    private var cookieImage: some View {
        // ���用 SF Symbol 或自定义图像
        Image(systemName: "oval.fill")
            .resizable()
            .aspectRatio(2/1, contentMode: .fit)
            .frame(width: 160, height: 80)
            .foregroundStyle(
                LinearGradient(
                    colors: [
                        Color(red: 255/255, green: 220/255, blue: 150/255),
                        Color(red: 230/255, green: 180/255, blue: 100/255)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 5)
    }
    
    private var cookieLeftHalf: some View {
        Image(systemName: "oval.lefthalf.filled")
            .resizable()
            .aspectRatio(1/1, contentMode: .fit)
            .frame(width: 80, height: 80)
            .foregroundColor(Color(red: 240/255, green: 200/255, blue: 130/255))
    }
    
    private var cookieRightHalf: some View {
        Image(systemName: "oval.righthalf.filled")
            .resizable()
            .aspectRatio(1/1, contentMode: .fit)
            .frame(width: 80, height: 80)
            .foregroundColor(Color(red: 240/255, green: 200/255, blue: 130/255))
    }
    
    private var cookieCrumbs: some View {
        HStack(spacing: 20) {
            ForEach(0..<5, id: \.self) { _ in
                Circle()
                    .fill(Color(red: 230/255, green: 180/255, blue: 100/255))
                    .frame(width: CGFloat.random(in: 8...15))
            }
        }
    }
    
    // MARK: - Animations
    private func startIdleAnimation() {
        withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) {
            scale = 1.05
        }
        
        withAnimation(.easeInOut(duration: 4).repeatForever(autoreverses: true)) {
            rotation = 3
        }
    }
    
    private func startCrackAnimation() {
        withAnimation(.easeOut(duration: 2)) {
            crackOffset = 50
            particleOpacity = 1
        }
        
        // 粒子消失
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            withAnimation(.easeOut(duration: 0.5)) {
                particleOpacity = 0
            }
        }
    }
}

// MARK: - Fortune Message Card
struct FortuneMessageCard: View {
    let fortune: Fortune
    
    var body: some View {
        VStack(spacing: 16) {
            // 主题标签
            HStack {
                if let theme = FortuneRequest.Theme(rawValue: fortune.theme) {
                    ThemeBadge(theme: theme)
                }
                
                Spacer()
                
                if fortune.source == .fallback {
                    Text("离线")
                        .font(.caption2)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(4)
                }
            }
            
            // 消息内容
            Text(fortune.message)
                .font(.title3)
                .fontWeight(.medium)
                .multilineTextAlignment(.center)
                .foregroundColor(.primary)
                .lineSpacing(4)
            
            // 幸运数字
            LuckyNumbersView(numbers: fortune.luckyNumbers)
        }
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.cardBackground)
                .shadow(color: .black.opacity(0.1), radius: 10, x: 0, y: 4)
        )
        .padding(.horizontal)
    }
}
```

### 5.3 幸运数字动画

```swift
// Features/Home/Components/LuckyNumbersView.swift
import SwiftUI

struct LuckyNumbersView: View {
    let numbers: [Int]
    @State private var visibleCount: Int = 0
    
    var body: some View {
        VStack(spacing: 8) {
            Text("幸运数字")
                .font(.caption)
                .foregroundColor(.secondary)
            
            HStack(spacing: 10) {
                ForEach(Array(numbers.enumerated()), id: \.offset) { index, number in
                    if index < visibleCount {
                        NumberCircle(number: number)
                            .transition(.scale.combined(with: .opacity))
                    }
                }
            }
        }
        .onAppear {
            animateNumbers()
        }
    }
    
    private func animateNumbers() {
        for i in 0..<numbers.count {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(i) * 0.15) {
                withAnimation(.spring(response: 0.4, dampingFraction: 0.6)) {
                    visibleCount = i + 1
                }
                HapticManager.shared.impact(style: .light)
            }
        }
    }
}

struct NumberCircle: View {
    let number: Int
    
    var body: some View {
        Text("\(number)")
            .font(.system(size: 16, weight: .bold, design: .rounded))
            .foregroundColor(.white)
            .frame(width: 36, height: 36)
            .background(
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color.brandAmber, Color.brandOrange],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            )
            .shadow(color: Color.brandOrange.opacity(0.3), radius: 4, x: 0, y: 2)
    }
}
```

### 5.4 主题选择器

```swift
// Features/Home/Components/ThemeSelectorView.swift
import SwiftUI

struct ThemeSelectorView: View {
    @Binding var selectedTheme: FortuneRequest.Theme
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(FortuneRequest.Theme.allCases) { theme in
                    ThemeButton(
                        theme: theme,
                        isSelected: selectedTheme == theme
                    ) {
                        withAnimation(.spring(response: 0.3)) {
                            selectedTheme = theme
                        }
                        HapticManager.shared.impact(style: .light)
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}

struct ThemeButton: View {
    let theme: FortuneRequest.Theme
    let isSelected: Bool
    let action: () -> Void
    
    private var themeColor: Color.ThemeColor {
        Color.fortuneTheme.color(for: theme)
    }
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Text(theme.emoji)
                    .font(.title2)
                
                Text(theme.displayName)
                    .font(.caption)
                    .fontWeight(.medium)
            }
            .foregroundColor(isSelected ? themeColor.foreground : .secondary)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? themeColor.background : Color.secondaryBackground)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(
                        isSelected ? themeColor.foreground : Color.clear,
                        lineWidth: 2
                    )
            )
        }
        .buttonStyle(.plain)
        .scaleEffect(isSelected ? 1.05 : 1.0)
        .animation(.spring(response: 0.3), value: isSelected)
    }
}

// MARK: - Theme Badge
struct ThemeBadge: View {
    let theme: FortuneRequest.Theme
    
    private var themeColor: Color.ThemeColor {
        Color.fortuneTheme.color(for: theme)
    }
    
    var body: some View {
        HStack(spacing: 4) {
            Text(theme.emoji)
                .font(.caption2)
            Text(theme.displayName)
                .font(.caption2)
                .fontWeight(.medium)
        }
        .foregroundColor(themeColor.foreground)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(
            Capsule()
                .fill(themeColor.background)
        )
    }
}
```

### 5.5 配额显示组件

```swift
// Features/Profile/Components/QuotaDisplayView.swift
import SwiftUI

struct QuotaDisplayView: View {
    let quota: QuotaStatus
    
    var body: some View {
        VStack(spacing: 12) {
            // 进度环
            ZStack {
                Circle()
                    .stroke(Color.gray.opacity(0.2), lineWidth: 8)
                
                Circle()
                    .trim(from: 0, to: 1 - quota.usagePercentage)
                    .stroke(
                        quota.hasQuota ? Color.brandOrange : Color.red,
                        style: StrokeStyle(lineWidth: 8, lineCap: .round)
                    )
                    .rotationEffect(.degrees(-90))
                    .animation(.spring(), value: quota.usagePercentage)
                
                VStack(spacing: 2) {
                    Text("\(quota.remaining)")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundColor(quota.hasQuota ? .primary : .red)
                    
                    Text("剩余")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            .frame(width: 80, height: 80)
            
            // 信息文字
            VStack(spacing: 4) {
                Text("每日配额")
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Text("\(quota.used)/\(quota.limit) 已使用")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                if !quota.hasQuota {
                    Text(quota.resetTimeString + "重置")
                        .font(.caption2)
                        .foregroundColor(.orange)
                }
                
                if !quota.isAuthenticated {
                    Text("登录获取更多配额")
                        .font(.caption2)
                        .foregroundColor(.blue)
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.cardBackground)
        )
    }
}
```

### 5.6 触觉反馈管理

```swift
// Shared/Utilities/HapticManager.swift
import UIKit

final class HapticManager {
    static let shared = HapticManager()
    
    private init() {}
    
    func impact(style: UIImpactFeedbackGenerator.FeedbackStyle) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.impactOccurred()
    }
    
    func notification(type: UINotificationFeedbackGenerator.FeedbackType) {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(type)
    }
    
    func selection() {
        let generator = UISelectionFeedbackGenerator()
        generator.selectionChanged()
    }
}
```

---

## 第 6 章：数据同步与缓存

### 6.1 Core Data 模型

在 `FortuneCookieAI.xcdatamodeld` 中创建以下实体：

#### CachedFortune 实体

| 属性 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| message | String | 消息内容 |
| luckyNumbers | Transformable | [Int] 数组 |
| theme | String | 主题 |
| source | String | 来源 (ai/database/fallback) |
| timestamp | Date | 生成时间 |
| isFavorite | Boolean | 是否收藏 |
| lastAccessed | Date | 最后访问时间 |

#### CachedFortuneMessage 实体

| 属性 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| message | String | 消息内容 |
| category | String | 分类 |
| tags | Transformable | [String] 数组 |
| luckyNumbers | Transformable | [Int] 数组 |
| popularity | Int16 | 热度 |
| dateAdded | String | 添加日期 |
| lastSynced | Date | 最后同步时间 |

### 6.2 持久化控制器

```swift
// Core/Persistence/PersistenceController.swift
import CoreData

struct PersistenceController {
    static let shared = PersistenceController()
    
    let container: NSPersistentContainer
    
    var viewContext: NSManagedObjectContext {
        container.viewContext
    }
    
    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "FortuneCookieAI")
        
        if inMemory {
            container.persistentStoreDescriptions.first?.url = URL(fileURLWithPath: "/dev/null")
        }
        
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Core Data 加载失败: \(error)")
            }
        }
        
        container.viewContext.automaticallyMergesChangesFromParent = true
        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
    }
    
    // MARK: - 后台上下文
    func newBackgroundContext() -> NSManagedObjectContext {
        let context = container.newBackgroundContext()
        context.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
        return context
    }
    
    // MARK: - 保存
    func save(context: NSManagedObjectContext? = nil) {
        let ctx = context ?? viewContext
        
        guard ctx.hasChanges else { return }
        
        do {
            try ctx.save()
        } catch {
            print("Core Data 保存失败: \(error)")
        }
    }
    
    // MARK: - 预览用
    static var preview: PersistenceController = {
        let controller = PersistenceController(inMemory: true)
        // 添加示例数据
        return controller
    }()
}
```

### 6.3 缓存服务

```swift
// Core/Services/CacheService.swift
import Foundation
import CoreData

actor CacheService {
    static let shared = CacheService()
    
    private let persistence = PersistenceController.shared
    
    private init() {}
    
    // MARK: - 缓存 AI 生成的幸运消息
    func cacheFortune(_ fortune: Fortune) async {
        let context = persistence.newBackgroundContext()
        
        await context.perform {
            let entity = CachedFortune(context: context)
            entity.id = fortune.id ?? UUID().uuidString
            entity.message = fortune.message
            entity.luckyNumbers = fortune.luckyNumbers as NSArray
            entity.theme = fortune.theme
            entity.source = fortune.source?.rawValue ?? "unknown"
            entity.timestamp = fortune.timestampDate ?? Date()
            entity.isFavorite = false
            entity.lastAccessed = Date()
            
            self.persistence.save(context: context)
        }
    }
    
    // MARK: - 获取缓存的幸运消息
    func getCachedFortunes(limit: Int = 50) async -> [Fortune] {
        let context = persistence.viewContext
        let request: NSFetchRequest<CachedFortune> = CachedFortune.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \CachedFortune.lastAccessed, ascending: false)]
        request.fetchLimit = limit
        
        do {
            let results = try context.fetch(request)
            return results.map { $0.toFortune() }
        } catch {
            print("获取缓存失败: \(error)")
            return []
        }
    }
    
    // MARK: - 收藏管理
    func saveFavorite(_ fortune: Fortune) async {
        let context = persistence.newBackgroundContext()
        
        await context.perform {
            // 检查是否已存在
            let request: NSFetchRequest<CachedFortune> = CachedFortune.fetchRequest()
            request.predicate = NSPredicate(format: "message == %@", fortune.message)
            
            do {
                if let existing = try context.fetch(request).first {
                    existing.isFavorite = true
                } else {
                    let entity = CachedFortune(context: context)
                    entity.id = fortune.id ?? UUID().uuidString
                    entity.message = fortune.message
                    entity.luckyNumbers = fortune.luckyNumbers as NSArray
                    entity.theme = fortune.theme
                    entity.source = fortune.source?.rawValue ?? "unknown"
                    entity.timestamp = fortune.timestampDate ?? Date()
                    entity.isFavorite = true
                    entity.lastAccessed = Date()
                }
                
                self.persistence.save(context: context)
            } catch {
                print("保存收藏失败: \(error)")
            }
        }
    }
    
    func removeFavorite(_ fortune: Fortune) async {
        let context = persistence.newBackgroundContext()
        
        await context.perform {
            let request: NSFetchRequest<CachedFortune> = CachedFortune.fetchRequest()
            request.predicate = NSPredicate(format: "message == %@", fortune.message)
            
            do {
                if let existing = try context.fetch(request).first {
                    existing.isFavorite = false
                    self.persistence.save(context: context)
                }
            } catch {
                print("移除收藏失败: \(error)")
            }
        }
    }
    
    func getFavorites() async -> [Fortune] {
        let context = persistence.viewContext
        let request: NSFetchRequest<CachedFortune> = CachedFortune.fetchRequest()
        request.predicate = NSPredicate(format: "isFavorite == YES")
        request.sortDescriptors = [NSSortDescriptor(keyPath: \CachedFortune.timestamp, ascending: false)]
        
        do {
            let results = try context.fetch(request)
            return results.map { $0.toFortune() }
        } catch {
            print("获取收藏失败: \(error)")
            return []
        }
    }
    
    func isFavorite(_ fortune: Fortune) async -> Bool {
        let context = persistence.viewContext
        let request: NSFetchRequest<CachedFortune> = CachedFortune.fetchRequest()
        request.predicate = NSPredicate(
            format: "message == %@ AND isFavorite == YES",
            fortune.message
        )
        
        do {
            return try context.count(for: request) > 0
        } catch {
            return false
        }
    }
    
    // MARK: - 缓存消息库
    func cacheFortuneMessages(_ messages: [FortuneMessage]) async {
        let context = persistence.newBackgroundContext()
        
        await context.perform {
            for message in messages {
                let request: NSFetchRequest<CachedFortuneMessage> = CachedFortuneMessage.fetchRequest()
                request.predicate = NSPredicate(format: "id == %@", message.id)
                
                do {
                    let existing = try context.fetch(request).first
                    let entity = existing ?? CachedFortuneMessage(context: context)
                    
                    entity.id = message.id
                    entity.message = message.message
                    entity.category = message.category.rawValue
                    entity.tags = message.tags as NSArray
                    entity.luckyNumbers = message.luckyNumbers as NSArray
                    entity.popularity = Int16(message.popularity)
                    entity.dateAdded = message.dateAdded
                    entity.lastSynced = Date()
                } catch {
                    print("缓存消息失败: \(error)")
                }
            }
            
            self.persistence.save(context: context)
        }
    }
    
    func getCachedFortuneMessages(category: String? = nil, limit: Int = 100) async -> [FortuneMessage] {
        let context = persistence.viewContext
        let request: NSFetchRequest<CachedFortuneMessage> = CachedFortuneMessage.fetchRequest()
        
        if let category = category {
            request.predicate = NSPredicate(format: "category == %@", category)
        }
        
        request.sortDescriptors = [NSSortDescriptor(keyPath: \CachedFortuneMessage.popularity, ascending: false)]
        request.fetchLimit = limit
        
        do {
            let results = try context.fetch(request)
            return results.compactMap { $0.toFortuneMessage() }
        } catch {
            print("获取缓存消息失败: \(error)")
            return []
        }
    }
    
    // MARK: - 清理过期缓存
    func cleanupExpiredCache(olderThan days: Int = 7) async {
        let context = persistence.newBackgroundContext()
        let cutoffDate = Calendar.current.date(byAdding: .day, value: -days, to: Date())!
        
        await context.perform {
            // 清理非收藏的旧缓存
            let request: NSFetchRequest<NSFetchRequestResult> = CachedFortune.fetchRequest()
            request.predicate = NSPredicate(
                format: "lastAccessed < %@ AND isFavorite == NO",
                cutoffDate as NSDate
            )
            
            let deleteRequest = NSBatchDeleteRequest(fetchRequest: request)
            
            do {
                try context.execute(deleteRequest)
            } catch {
                print("清理缓存失败: \(error)")
            }
        }
    }
}

// MARK: - Core Data Entity Extensions
extension CachedFortune {
    func toFortune() -> Fortune {
        Fortune(
            id: id,
            message: message ?? "",
            luckyNumbers: (luckyNumbers as? [Int]) ?? [],
            theme: theme ?? "random",
            timestamp: (timestamp ?? Date()).ISO8601Format(),
            source: Fortune.FortuneSource(rawValue: source ?? ""),
            cached: true,
            aiError: nil
        )
    }
}

extension CachedFortuneMessage {
    func toFortuneMessage() -> FortuneMessage? {
        guard let id = id,
              let message = message,
              let categoryString = category,
              let category = FortuneMessage.Category(rawValue: categoryString) else {
            return nil
        }
        
        return FortuneMessage(
            id: id,
            message: message,
            category: category,
            tags: (tags as? [String]) ?? [],
            luckyNumbers: (luckyNumbers as? [Int]) ?? [],
            popularity: Int(popularity),
            dateAdded: dateAdded ?? ""
        )
    }
}
```

### 6.4 同步服务

```swift
// Core/Services/SyncService.swift
import Foundation
import Combine

@MainActor
class SyncService: ObservableObject {
    static let shared = SyncService()
    
    @Published var lastSyncDate: Date?
    @Published var isSyncing: Bool = false
    @Published var syncError: String?
    
    private let fortuneAPI = FortuneAPI()
    private let cacheService = CacheService.shared
    private let syncIntervalHours: Int = 24
    
    private init() {
        loadLastSyncDate()
    }
    
    // MARK: - 检查并同步
    func checkAndSyncIfNeeded() async {
        guard shouldSync() else { return }
        await syncPopularFortunes()
    }
    
    private func shouldSync() -> Bool {
        guard let lastSync = lastSyncDate else { return true }
        let hoursSinceLastSync = Calendar.current.dateComponents(
            [.hour],
            from: lastSync,
            to: Date()
        ).hour ?? 0
        return hoursSinceLastSync >= syncIntervalHours
    }
    
    // MARK: - 同步热门消息
    func syncPopularFortunes() async {
        guard !isSyncing else { return }
        
        isSyncing = true
        syncError = nil
        
        do {
            // 同步每个分类的热门消息
            for category in FortuneMessage.Category.allCases {
                let (results, _) = try await fortuneAPI.browseFortunes(
                    action: .popular,
                    category: category.rawValue,
                    limit: 50
                )
                
                await cacheService.cacheFortuneMessages(results)
            }
            
            lastSyncDate = Date()
            saveLastSyncDate()
            
        } catch {
            syncError = error.localizedDescription
            print("同步失败: \(error)")
        }
        
        isSyncing = false
    }
    
    // MARK: - 持久化同步时间
    private func loadLastSyncDate() {
        lastSyncDate = UserDefaults.standard.object(forKey: "lastSyncDate") as? Date
    }
    
    private func saveLastSyncDate() {
        UserDefaults.standard.set(lastSyncDate, forKey: "lastSyncDate")
    }
}
```

---

## 第 7 章：测试策略

### 7.1 单元测试

```swift
// Tests/FortuneViewModelTests.swift
import XCTest
@testable import FortuneCookieAI

@MainActor
final class FortuneViewModelTests: XCTestCase {
    var sut: HomeViewModel!
    var mockAPI: MockFortuneAPI!
    var mockCacheService: MockCacheService!
    
    override func setUp() async throws {
        mockAPI = MockFortuneAPI()
        mockCacheService = MockCacheService()
        sut = HomeViewModel(
            fortuneAPI: mockAPI,
            cacheService: mockCacheService
        )
    }
    
    override func tearDown() async throws {
        sut = nil
        mockAPI = nil
        mockCacheService = nil
    }
    
    // MARK: - 生成成功测试
    func testGenerateFortune_Success() async {
        // Given
        mockAPI.mockFortune = Fortune(
            id: "test-1",
            message: "测试幸运消息",
            luckyNumbers: [1, 2, 3, 4, 5, 6],
            theme: "random",
            timestamp: ISO8601DateFormatter().string(from: Date()),
            source: .ai,
            cached: false,
            aiError: nil
        )
        
        mockAPI.mockQuota = QuotaStatus(
            limit: 10,
            used: 0,
            remaining: 10,
            resetsAtUtc: ISO8601DateFormatter().string(from: Date().addingTimeInterval(86400)),
            isAuthenticated: false
        )
        
        await sut.loadQuota()
        
        // When
        await sut.generateFortune()
        
        // 等待动画完成
        try? await Task.sleep(nanoseconds: 2_500_000_000)
        
        // Then
        XCTAssertEqual(sut.fortune?.message, "测试幸运消息")
        XCTAssertEqual(sut.cookieState, .opened)
        XCTAssertNil(sut.error)
    }
    
    // MARK: - 配额用尽测试
    func testGenerateFortune_QuotaExceeded() async {
        // Given
        sut.quotaStatus = QuotaStatus(
            limit: 1,
            used: 1,
            remaining: 0,
            resetsAtUtc: ISO8601DateFormatter().string(from: Date().addingTimeInterval(86400)),
            isAuthenticated: false
        )
        
        // When
        await sut.generateFortune()
        
        // Then
        XCTAssertEqual(sut.cookieState, .unopened)
        XCTAssertTrue(sut.showSignInPrompt)
    }
    
    // MARK: - 重置测试
    func testResetCookie() async {
        // Given
        sut.cookieState = .opened
        sut.fortune = Fortune(
            id: "test",
            message: "test",
            luckyNumbers: [1],
            theme: "random",
            timestamp: "",
            source: nil,
            cached: nil,
            aiError: nil
        )
        sut.customPrompt = "custom"
        
        // When
        sut.resetCookie()
        
        // Then
        XCTAssertEqual(sut.cookieState, .unopened)
        XCTAssertNil(sut.fortune)
        XCTAssertTrue(sut.customPrompt.isEmpty)
    }
}

// MARK: - Mock Classes
class MockFortuneAPI: FortuneAPI {
    var mockFortune: Fortune?
    var mockQuota: QuotaStatus?
    var mockError: Error?
    
    override func generateFortune(request: FortuneRequest) async throws -> Fortune {
        if let error = mockError {
            throw error
        }
        return mockFortune!
    }
    
    override func getQuotaStatus() async throws -> QuotaStatus {
        if let error = mockError {
            throw error
        }
        return mockQuota!
    }
}

class MockCacheService: CacheService {
    var favorites: [Fortune] = []
    
    override func saveFavorite(_ fortune: Fortune) async {
        favorites.append(fortune)
    }
    
    override func removeFavorite(_ fortune: Fortune) async {
        favorites.removeAll { $0.message == fortune.message }
    }
    
    override func getFavorites() async -> [Fortune] {
        return favorites
    }
    
    override func isFavorite(_ fortune: Fortune) async -> Bool {
        return favorites.contains { $0.message == fortune.message }
    }
}
```

### 7.2 UI 测试

```swift
// UITests/FortuneCookieUITests.swift
import XCTest

final class FortuneCookieUITests: XCTestCase {
    var app: XCUIApplication!
    
    override func setUp() {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments = ["--uitesting"]
        app.launch()
    }
    
    // MARK: - 主页测试
    func testHomePage_ShowsCookie() {
        // 验证饼干显示
        let cookieView = app.otherElements["fortune-cookie"]
        XCTAssertTrue(cookieView.waitForExistence(timeout: 5))
    }
    
    func testHomePage_ThemeSelector() {
        // 验证主题选择器
        let themePicker = app.scrollViews["theme-selector"]
        XCTAssertTrue(themePicker.exists)
        
        // 点击励志主题
        let inspirationalButton = app.buttons["theme-inspirational"]
        XCTAssertTrue(inspirationalButton.exists)
        inspirationalButton.tap()
    }
    
    // MARK: - 生成测试
    func testGenerateFortune() {
        // 点击饼干
        let cookieView = app.otherElements["fortune-cookie"]
        XCTAssertTrue(cookieView.waitForExistence(timeout: 5))
        cookieView.tap()
        
        // 等待生成完成
        let fortuneMessage = app.staticTexts["fortune-message"]
        XCTAssertTrue(fortuneMessage.waitForExistence(timeout: 10))
    }
    
    // MARK: - 导航测试
    func testNavigation_Browse() {
        // 切换到浏览页
        app.tabBars.buttons["浏览"].tap()
        
        // 验证浏览页显示
        let browseTitle = app.navigationBars["浏览消息"]
        XCTAssertTrue(browseTitle.waitForExistence(timeout: 5))
    }
    
    func testNavigation_Favorites() {
        // 切换到收藏页
        app.tabBars.buttons["收藏"].tap()
        
        // 验证收藏页显示
        let favoritesTitle = app.navigationBars["我的收藏"]
        XCTAssertTrue(favoritesTitle.waitForExistence(timeout: 5))
    }
}
```

### 7.3 网络集成测试

```swift
// Tests/APIIntegrationTests.swift
import XCTest
@testable import FortuneCookieAI

final class APIIntegrationTests: XCTestCase {
    var api: FortuneAPI!
    
    override func setUp() async throws {
        api = FortuneAPI()
    }
    
    // MARK: - 配额 API 测试
    func testGetQuotaStatus() async throws {
        // When
        let quota = try await api.getQuotaStatus()
        
        // Then
        XCTAssertGreaterThan(quota.limit, 0)
        XCTAssertLessThanOrEqual(quota.used, quota.limit)
        XCTAssertNotNil(quota.resetsAt)
    }
    
    // MARK: - 浏览 API 测试
    func testBrowseFortunes_List() async throws {
        // When
        let (results, pagination) = try await api.browseFortunes(
            action: .list,
            page: 1,
            limit: 10
        )
        
        // Then
        XCTAssertFalse(results.isEmpty)
        XCTAssertEqual(results.count, 10)
        XCTAssertNotNil(pagination)
    }
    
    func testBrowseFortunes_Category() async throws {
        // When
        let (results, _) = try await api.getFortunesByCategory(
            category: .inspirational,
            limit: 5
        )
        
        // Then
        XCTAssertFalse(results.isEmpty)
        XCTAssertTrue(results.allSatisfy { $0.category == .inspirational })
    }
    
    func testBrowseFortunes_Search() async throws {
        // When
        let (results, _) = try await api.searchFortunes(
            query: "幸运",
            limit: 10
        )
        
        // Then
        // 搜索结果可能为空，但不应抛出错误
        XCTAssertNotNil(results)
    }
    
    // MARK: - 随机消息测试
    func testGetRandomFortunes() async throws {
        // When
        let results = try await api.getRandomFortunes(count: 3)
        
        // Then
        XCTAssertEqual(results.count, 3)
    }
}
```

---

## 第 8 章：部署与上架

### 8.1 App Store 资源清单

#### 应用图标

准备以下尺寸的图标（PNG 格式，无透明度）：

| 尺寸 | 用途 |
|------|------|
| 1024×1024 | App Store |
| 180×180 | iPhone (@3x) |
| 120×120 | iPhone (@2x) |
| 167×167 | iPad Pro (@2x) |
| 152×152 | iPad (@2x) |

#### 截图尺寸

| 设备 | 尺寸 | 数量 |
|------|------|------|
| iPhone 15 Pro Max | 1290×2796 | 3-10 张 |
| iPhone 15 Pro | 1179×2556 | 3-10 张 |
| iPhone SE | 1242×2208 | 3-10 张 |
| iPad Pro 12.9" | 2048×2732 | 3-10 张 |

### 8.2 App Store Connect 配置

#### 应用信息

```yaml
应用名称: Fortune Cookie AI
副标题: AI 智能幸运饼干

关键词: 幸运饼干,AI,运势,签语,占卜,每日签,好运,智慧语录,励志,正能量

简短描述:
打开虚拟幸运饼干，获取 AI 生成的个性化幸运消息和幸运数字。

完整描述:
Fortune Cookie AI 是一款创新的 AI 幸运饼干应用，让你随时随地获取专属的幸运消息。

主要功能：
• AI 智能生成：基于先进 AI 技术，生成独一无二的幸运消息
• 6 大主题：搞笑、励志、爱情、成功、智慧、随机
• 500+ 经典消息：精选收录各类经典幸运语
• 幸运数字：每次开启都会获得专属幸运数字
• 收藏功能：保存喜爱的幸运消息
• 离线浏览：已缓存的消息可离线查看
• 精美动画：逼真的饼干开启动画体验

每日运势，好运相伴！

支持网址: https://fortunecookieai.com/support
隐私政策: https://fortunecookieai.com/privacy
```

### 8.3 隐私政策要点

根据 App Store 要求，需要在隐私政策中说明：

1. **数据收集**：
   - 邮箱地址（可选，用于登录）
   - 设备标识符（用于配额追踪）
   - 使用数据（生成次数、主题偏好）

2. **数据用途**：
   - 提供个性化服务
   - 配额管理
   - 改进应用体验

3. **第三方 SDK**：
   - Google Sign-In（用于身份验证）

### 8.4 审核注意事项

1. **功能完整性**：确保所有功能正常工作，包括离线模式
2. **网络错误处理**：优雅处理网络断开情况
3. **配额限制说明**：在 UI 中清晰显示配额限制和重置时间
4. **内购说明**（如有）：明确付费功能和免费功能的区别
5. **年龄分级**：建议 4+，无不当内容

### 8.5 TestFlight 测试

```yaml
测试计划:
  内部测试:
    - 开发者自测所有功能
    - 检查所有设备尺寸的 UI 适配
    - 验证网络错误处理
    - 确认离线功能正常
    
  外部测试:
    - 邀请 20-50 名测试用户
    - 收集反馈和崩溃报告
    - 测试周期：1-2 周
    - 关注：用户体验、性能、稳定性
```

---

## 第 9 章：开发时间规划

### 9.1 整体时间线

作为独立开发者，建议按以下阶段进行开发。时间仅供参考，可根据个人节奏调整。

```
┌─────────────────────────────────────────────────────────────────┐
│                    Fortune Cookie AI iOS                        │
│                    开发时间规划 (10-12 周)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1: 基础架构 (第 1-2 周)                                    │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░         │
│                                                                  │
│  Phase 2: 核心功能 (第 3-4 周)                                    │
│  ░░░░░░░░░░░░░░░░████████████████░░░░░░░░░░░░░░░░░░░░░░         │
│                                                                  │
│  Phase 3: 浏览与收藏 (第 5-6 周)                                  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████████░░░░░░         │
│                                                                  │
│  Phase 4: 认证系统 (第 7 周)                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████       │
│                                                                  │
│  Phase 5: 动画与打磨 (第 8-9 周)                                  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████   │
│                                                                  │
│  Phase 6: 测试与上架 (第 10-12 周)                                │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 详细任务分解

#### Phase 1: 基础架构 (第 1-2 周)

- [ ] 创建 Xcode 项目
- [ ] 配置 Swift Package Manager 依赖
- [ ] 实现 APIClient 网络层
- [ ] 实现 FortuneAPI 服务
- [ ] 创建数据模型 (Fortune, QuotaStatus, etc.)
- [ ] 配置 Core Data 数据模型
- [ ] 实现 PersistenceController
- [ ] 实现 CacheService 基础功能
- [ ] 配置环境变量管理
- [ ] 实现 ClientIdentifier

#### Phase 2: 核心功能 (第 3-4 周)

- [ ] 实现 HomeViewModel
- [ ] 创建 HomeView 布局
- [ ] 实现 FortuneCookieView 基础版本
- [ ] 实现 ThemeSelectorView
- [ ] 实现 LuckyNumbersView
- [ ] 实现 QuotaDisplayView
- [ ] 实现 CustomPromptView
- [ ] 连接 API 生成功能
- [ ] 实现错误处理和回退逻辑
- [ ] 添加触觉反馈

#### Phase 3: 浏览与收藏 (第 5-6 周)

- [ ] 实现 BrowseViewModel
- [ ] 创建 BrowseView 布局
- [ ] 实现 FortuneCardView
- [ ] 实现 CategoryFilterView
- [ ] 实现 SearchBarView
- [ ] 实现分页加载
- [ ] 实现 FavoritesViewModel
- [ ] 创建 FavoritesView 布局
- [ ] 实现收藏的增删功能
- [ ] 实现离线缓存功能

#### Phase 4: 认证系统 (第 7 周)

- [ ] 配置 Google Sign-In SDK
- [ ] 实现 AuthService
- [ ] 创建 ProfileView
- [ ] 实现 SignInButtonView
- [ ] 实现登录/登出流程
- [ ] 实现会话持久化
- [ ] 处理认证状态变化
- [ ] 配置后端认证端点（可选）

#### Phase 5: 动画与打磨 (第 8-9 周)

- [ ] 完善饼干开启动画
- [ ] 添加粒子效果
- [ ] 实现幸运数字交错动画
- [ ] 添加页面转场动画
- [ ] 实现深色模式适配
- [ ] 优化 UI 细节
- [ ] 添加空状态和加载状态
- [ ] 实现 Toast 提示
- [ ] 性能优化
- [ ] 内存泄漏检查

#### Phase 6: 测试与上架 (第 10-12 周)

- [ ] 编写单元测试
- [ ] 编写 UI 测试
- [ ] 执行集成测试
- [ ] 准备 App Store 资源
- [ ] 撰写应用描述
- [ ] 配置 App Store Connect
- [ ] TestFlight 内部测试
- [ ] TestFlight 外部测试
- [ ] 修复反馈问题
- [ ] 提交审核
- [ ] 处理审核反馈
- [ ] 正式发布

### 9.3 开发建议

#### 优先级原则

1. **先实现核心功能**：幸运消息生成是应用核心，优先保证其稳定
2. **离线优先**：即使网络不可用，用户也应能使用基本功能
3. **渐进增强**：先实现基础版本，再添加高级功能和动画

#### 风险管理

| 风险 | 缓解措施 |
|------|----------|
| 后端 API 变更 | 抽象网络层，便于适配 |
| Google 登录审核 | 先实现游客模式，登录作为增强功能 |
| 动画性能 | 使用 Instruments 分析，优化关键路径 |
| App Store 拒绝 | 仔细阅读审核指南，提前处理常见问题 |

#### 版本规划

```yaml
v1.0.0 (首发版本):
  - 幸运消息生成
  - 消息浏览
  - 收藏功能
  - 离线支持
  - 游客模式

v1.1.0 (功能增强):
  - Google 登录
  - 配额同步
  - 动画优化

v1.2.0 (体验提升):
  - Widget 支持
  - Apple Watch 版本
  - 分享功能增强
```

---

## 附录

### A. 常见问题

**Q: 如何处理没有网络的情况？**

A: 应用采用离线优先策略：
1. 检测网络状态，显示离线指示器
2. 使用本地缓存的消息
3. 在无网络时禁用 AI 生成，但允许浏览已缓存内容

**Q: 配额用完后怎么办？**

A: 
1. 游客用户：提示登录获取更多配额
2. 已登录用户：显示重置时间
3. 所有用户：仍可浏览已缓存的消息库

**Q: 如何调试 API 请求？**

A: 
1. 使用 Charles Proxy 或 Proxyman 抓包
2. 在 APIClient 中添加请求日志
3. 使用 Xcode 的 Network Link Conditioner 模拟弱网

### B. 资源链接

- [SwiftUI 官方文档](https://developer.apple.com/documentation/swiftui)
- [Alamofire 文档](https://github.com/Alamofire/Alamofire)
- [Google Sign-In iOS 文档](https://developers.google.com/identity/sign-in/ios)
- [App Store Connect 帮助](https://help.apple.com/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### C. 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0 | 2025-01 | 初始版本 |

---

*本文档由 Fortune Cookie AI 开发团队编写，持续更新中。*
