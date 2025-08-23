import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// SEO相关工具函数
export function generateMetaTitle(title: string, suffix?: string): string {
  const baseSuffix = suffix || "Fortune Cookie AI"
  return `${title} | ${baseSuffix}`
}

export function generateMetaDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description
  return description.substring(0, maxLength - 3) + "..."
}

// 幸运数字生成器 - 使用确定性随机数避免 SSR/CSR 不一致
export function generateLuckyNumbers(count: number = 6, max: number = 69, seed: number = 12345): number[] {
  const rng = new SeededRandom(seed)
  const numbers = new Set<number>()
  while (numbers.size < count) {
    numbers.add(Math.floor(rng.next() * max) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

// 格式化日期
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// 延迟函数
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 随机选择数组元素 - 使用确定性随机数避免 SSR/CSR 不一致
export function getRandomElement<T>(array: T[], seed: number = 12345): T {
  const rng = new SeededRandom(seed)
  return array[Math.floor(rng.next() * array.length)]
}

// 打乱数组 - 使用确定性随机数避免 SSR/CSR 不一致
export function shuffleArray<T>(array: T[], seed: number = 12345): T[] {
  const shuffled = [...array]
  const rng = new SeededRandom(seed)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 验证环境变量
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name]
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`)
  }
  return value || defaultValue!
}

// 生成唯一ID - 使用时间戳和计数器避免随机数
let idCounter = 0
export function generateId(): string {
  return (++idCounter).toString(36) + Date.now().toString(36)
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 确定性伪随机数生成器 (PRNG) - 用于避免 SSR/CSR hydration 不一致
export class SeededRandom {
  private seed: number

  constructor(seed: number = 12345) {
    this.seed = seed
  }

  // 线性同余生成器 (LCG)
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  // 生成指定范围内的随机数
  range(min: number, max: number): number {
    return min + this.next() * (max - min)
  }

  // 生成指定范围内的随机整数
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max))
  }
}

// 创建基于索引的确定性随机数生成器
export function createSeededRandom(index: number): SeededRandom {
  return new SeededRandom(12345 + index * 1000)
}
