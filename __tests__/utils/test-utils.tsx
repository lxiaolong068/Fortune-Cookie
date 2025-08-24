import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Mock data for testing
export const mockFortune = {
  id: 'test-fortune-1',
  message: '今天是美好的一天，充满无限可能！',
  category: 'inspirational',
  mood: 'positive',
  length: 'medium',
  source: 'ai',
  popularity: 10,
  tags: ['motivation', 'positive'],
  language: 'zh',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockFortuneList = [
  mockFortune,
  {
    id: 'test-fortune-2',
    message: '成功来自于坚持不懈的努力。',
    category: 'success',
    mood: 'motivational',
    length: 'short',
    source: 'database',
    popularity: 15,
    tags: ['success', 'motivation'],
    language: 'zh',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'test-fortune-3',
    message: '爱是世界上最强大的力量，它能够治愈一切伤痛，带来希望和温暖。',
    category: 'love',
    mood: 'positive',
    length: 'long',
    source: 'ai',
    popularity: 8,
    tags: ['love', 'healing'],
    language: 'zh',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
]

export const mockApiResponse = {
  success: true,
  data: mockFortune,
  timestamp: new Date().toISOString(),
}

export const mockErrorResponse = {
  success: false,
  error: 'Test error message',
  timestamp: new Date().toISOString(),
}

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Test utilities
export const createMockFetch = (response: any, ok: boolean = true) => {
  return jest.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response)),
    headers: new Headers(),
  })
}

export const createMockFetchError = (error: string) => {
  return jest.fn().mockRejectedValue(new Error(error))
}

// Wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock localStorage helpers
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Mock sessionStorage helpers
export const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Mock IntersectionObserver
export const mockIntersectionObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}

// Mock ResizeObserver
export const mockResizeObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}

// Test data generators
export const generateMockFortune = (overrides: Partial<typeof mockFortune> = {}) => ({
  ...mockFortune,
  id: `test-fortune-${Math.random().toString(36).substr(2, 9)}`,
  ...overrides,
})

export const generateMockFortuneList = (count: number = 3) => {
  return Array.from({ length: count }, (_, index) => 
    generateMockFortune({
      id: `test-fortune-${index + 1}`,
      message: `Test fortune message ${index + 1}`,
      popularity: Math.floor(Math.random() * 20),
    })
  )
}

// Mock API responses
export const mockApiSuccess = (data: any) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
})

export const mockApiError = (error: string, code?: string) => ({
  success: false,
  error,
  code,
  timestamp: new Date().toISOString(),
})

// Mock user interactions
export const mockUserEvent = {
  click: jest.fn(),
  type: jest.fn(),
  clear: jest.fn(),
  selectOptions: jest.fn(),
  upload: jest.fn(),
}

// Mock performance API
export const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
}

// Mock Web Vitals
export const mockWebVitals = {
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}

// Mock error monitoring
export const mockErrorMonitoring = {
  captureError: jest.fn(),
  captureApiError: jest.fn(),
  capturePerformanceIssue: jest.fn(),
  captureUserAction: jest.fn(),
  captureBusinessEvent: jest.fn(),
}

// Mock cache manager
export const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  isConnected: jest.fn(() => Promise.resolve(true)),
  getCacheStats: jest.fn(() => Promise.resolve({
    connected: true,
    hits: 100,
    misses: 20,
    errors: 0,
  })),
}

// Mock rate limiters
export const mockRateLimiters = {
  api: {
    limit: jest.fn(() => Promise.resolve({ success: true, limit: 100, remaining: 99, reset: Date.now() + 900000 })),
  },
  fortune: {
    limit: jest.fn(() => Promise.resolve({ success: true, limit: 10, remaining: 9, reset: Date.now() + 60000 })),
  },
  search: {
    limit: jest.fn(() => Promise.resolve({ success: true, limit: 30, remaining: 29, reset: Date.now() + 60000 })),
  },
}

// Mock database services
export const mockFortuneService = {
  create: jest.fn(),
  findMany: jest.fn(),
  findById: jest.fn(),
  findRandom: jest.fn(),
  findPopular: jest.fn(),
  search: jest.fn(),
  getStats: jest.fn(),
}

// Test assertion helpers
export const expectToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument()
}

export const expectToHaveClass = (element: HTMLElement | null, className: string) => {
  expect(element).toHaveClass(className)
}

export const expectToHaveTextContent = (element: HTMLElement | null, text: string) => {
  expect(element).toHaveTextContent(text)
}

// Cleanup helpers
export const cleanupMocks = () => {
  jest.clearAllMocks()
  mockLocalStorage.clear()
  mockSessionStorage.clear()
}
