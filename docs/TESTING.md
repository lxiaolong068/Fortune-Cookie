# 🧪 测试指南

## 概述

本项目采用全面的测试策略，包括单元测试、集成测试和端到端测试，确保代码质量和功能稳定性。

## 🏗️ 测试架构

### 测试框架和工具

- **Jest**: 单元测试和集成测试框架
- **React Testing Library**: React组件测试
- **Playwright**: 端到端测试
- **@testing-library/jest-dom**: DOM断言扩展

### 测试类型

1. **单元测试**: 测试独立的函数和组件
2. **集成测试**: 测试API路由和服务集成
3. **组件测试**: 测试React组件的行为和交互
4. **端到端测试**: 测试完整的用户流程

## 🔧 测试配置

### Jest 配置

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

### 测试环境设置

```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock Next.js components and hooks
jest.mock('next/router', () => ({ /* mock implementation */ }))
jest.mock('next/navigation', () => ({ /* mock implementation */ }))
```

## 📝 测试命令

### 基本命令

```bash
# 运行所有测试
npm test

# 监视模式运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# CI环境测试
npm run test:ci

# 运行特定类型的测试
npm run test:unit      # 单元测试
npm run test:api       # API测试
npm run test:components # 组件测试
npm run test:lib       # 工具库测试
```

### 覆盖率报告

```bash
# 生成详细覆盖率报告
node scripts/test-coverage-report.js

# 检查覆盖率是否达标
node scripts/test-coverage-report.js check
```

## 🧪 编写测试

### 单元测试示例

```typescript
// __tests__/lib/api-signature.test.ts
import { RequestSigner } from '@/lib/api-signature'

describe('RequestSigner', () => {
  it('generates consistent signatures', () => {
    const signature1 = RequestSigner.generateSignature(
      'secret', 'POST', '/api/test', 'body', 1234567890, 'nonce'
    )
    const signature2 = RequestSigner.generateSignature(
      'secret', 'POST', '/api/test', 'body', 1234567890, 'nonce'
    )
    
    expect(signature1).toBe(signature2)
    expect(signature1).toHaveLength(64)
  })
})
```

### 组件测试示例

```typescript
// __tests__/components/FortuneCard.test.tsx
import { render, screen, fireEvent } from '../utils/test-utils'
import { FortuneCard } from '@/components/FortuneCard'

describe('FortuneCard', () => {
  it('renders fortune message', () => {
    const mockFortune = {
      id: '1',
      message: '今天是美好的一天',
      category: 'inspirational',
      // ... other properties
    }
    
    render(<FortuneCard fortune={mockFortune} />)
    
    expect(screen.getByText('今天是美好的一天')).toBeInTheDocument()
  })
  
  it('handles like button click', async () => {
    const mockFortune = { /* ... */ }
    render(<FortuneCard fortune={mockFortune} />)
    
    const likeButton = screen.getByLabelText(/点赞/)
    fireEvent.click(likeButton)
    
    // Assert expected behavior
  })
})
```

### API测试示例

```typescript
// __tests__/api/fortune.test.ts
/**
 * @jest-environment node
 */
import { POST } from '@/app/api/fortune/route'
import { NextRequest } from 'next/server'

describe('/api/fortune', () => {
  it('generates fortune successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/fortune', {
      method: 'POST',
      body: JSON.stringify({ theme: 'inspirational' }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.message).toBeTruthy()
  })
})
```

## 🎯 测试最佳实践

### 1. 测试结构

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // 测试前的设置
  })
  
  afterEach(() => {
    // 测试后的清理
  })
  
  describe('when condition', () => {
    it('should do something', () => {
      // 测试实现
    })
  })
})
```

### 2. 测试命名

- 使用描述性的测试名称
- 遵循 "should do X when Y" 模式
- 用中文描述业务逻辑测试

### 3. 模拟和存根

```typescript
// Mock external dependencies
jest.mock('@/lib/openrouter', () => ({
  openRouterClient: {
    generateFortune: jest.fn(),
  },
}))

// Mock API responses
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ success: true }),
})
```

### 4. 测试数据

```typescript
// 使用测试工具函数
import { mockFortune, createMockFetch } from '../utils/test-utils'

// 生成测试数据
const testFortune = generateMockFortune({
  category: 'test',
  message: 'Test message',
})
```

## 📊 覆盖率目标

### 覆盖率阈值

- **语句覆盖率**: 70%
- **分支覆盖率**: 70%
- **函数覆盖率**: 70%
- **行覆盖率**: 70%

### 关键文件优先级

1. **核心业务逻辑**: `lib/` 目录下的工具函数
2. **API路由**: `app/api/` 目录下的路由处理器
3. **关键组件**: 主要的React组件
4. **数据服务**: 数据库和缓存服务

## 🔍 测试策略

### 单元测试策略

- 测试纯函数的输入输出
- 测试边界条件和错误情况
- 测试组件的渲染和交互
- 模拟外部依赖

### 集成测试策略

- 测试API端点的完整流程
- 测试数据库操作
- 测试缓存和限流功能
- 测试错误处理和恢复

### 端到端测试策略

- 测试关键用户流程
- 测试跨浏览器兼容性
- 测试性能和可访问性
- 测试移动端响应式设计

## 🚀 持续集成

### GitHub Actions 配置

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
```

### 测试报告

- 自动生成覆盖率报告
- 上传到代码覆盖率服务
- 在PR中显示覆盖率变化
- 设置覆盖率门槛检查

## 🛠️ 调试测试

### 调试技巧

```typescript
// 使用 screen.debug() 查看DOM结构
import { screen } from '@testing-library/react'

it('debugs component', () => {
  render(<MyComponent />)
  screen.debug() // 打印当前DOM
})

// 使用 waitFor 等待异步操作
import { waitFor } from '@testing-library/react'

it('waits for async operation', async () => {
  render(<AsyncComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

### 常见问题解决

1. **异步操作**: 使用 `waitFor` 或 `findBy*` 查询
2. **定时器**: 使用 `jest.useFakeTimers()`
3. **网络请求**: 模拟 `fetch` 或使用 MSW
4. **环境变量**: 在 `jest.env.js` 中设置

## 📚 相关资源

- [Jest 文档](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright 文档](https://playwright.dev/)
- [测试最佳实践](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
