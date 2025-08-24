#!/usr/bin/env node

/**
 * API签名测试工具
 * 用于测试和演示API请求签名功能
 */

const crypto = require('crypto')

// 配置
const CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  keyId: process.env.API_KEY_ID || 'dev-key-001',
  secret: process.env.API_KEY_SECRET || 'dev-secret-key',
  algorithm: 'sha256',
}

// 签名头部名称
const SIGNATURE_HEADERS = {
  SIGNATURE: 'X-API-Signature',
  TIMESTAMP: 'X-API-Timestamp',
  NONCE: 'X-API-Nonce',
  KEY_ID: 'X-API-Key-Id',
}

// 生成随机nonce
function generateNonce() {
  return crypto.randomBytes(16).toString('hex')
}

// 生成签名
function generateSignature(secret, method, path, body, timestamp, nonce) {
  const signatureString = [
    method.toUpperCase(),
    path,
    body || '',
    timestamp.toString(),
    nonce,
  ].join('\n')
  
  const hmac = crypto.createHmac(CONFIG.algorithm, secret)
  hmac.update(signatureString, 'utf8')
  return hmac.digest('hex')
}

// 为请求添加签名
function signRequest(keyId, secret, method, path, body) {
  const timestamp = Math.floor(Date.now() / 1000)
  const nonce = generateNonce()
  
  const signature = generateSignature(
    secret,
    method,
    path,
    body || '',
    timestamp,
    nonce
  )

  return {
    [SIGNATURE_HEADERS.SIGNATURE]: signature,
    [SIGNATURE_HEADERS.TIMESTAMP]: timestamp.toString(),
    [SIGNATURE_HEADERS.NONCE]: nonce,
    [SIGNATURE_HEADERS.KEY_ID]: keyId,
  }
}

// 发送签名请求
async function sendSignedRequest(method, path, body) {
  const url = `${CONFIG.baseUrl}${path}`
  const signatureHeaders = signRequest(CONFIG.keyId, CONFIG.secret, method, path, body)
  
  const headers = {
    'Content-Type': 'application/json',
    ...signatureHeaders,
  }

  console.log(`\n🔐 发送签名请求: ${method} ${path}`)
  console.log('签名头部:', JSON.stringify(signatureHeaders, null, 2))

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const responseData = await response.text()
    
    console.log(`\n📡 响应状态: ${response.status} ${response.statusText}`)
    console.log('响应头部:', Object.fromEntries(response.headers.entries()))
    console.log('响应内容:', responseData)

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message)
    return null
  }
}

// 发送未签名请求（用于对比）
async function sendUnsignedRequest(method, path, body) {
  const url = `${CONFIG.baseUrl}${path}`
  
  console.log(`\n🚫 发送未签名请求: ${method} ${path}`)

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const responseData = await response.text()
    
    console.log(`\n📡 响应状态: ${response.status} ${response.statusText}`)
    console.log('响应内容:', responseData)

    return {
      status: response.status,
      data: responseData,
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message)
    return null
  }
}

// 测试用例
async function runTests() {
  console.log('🧪 API签名验证测试')
  console.log('='.repeat(50))
  console.log(`基础URL: ${CONFIG.baseUrl}`)
  console.log(`API密钥ID: ${CONFIG.keyId}`)
  console.log(`密钥: ${CONFIG.secret.slice(0, 8)}...`)

  // 测试1: 缓存统计（需要签名）
  console.log('\n📊 测试1: 获取缓存统计')
  await sendSignedRequest('GET', '/api/cache?action=stats')

  // 测试2: 未签名请求（应该失败）
  console.log('\n🚫 测试2: 未签名请求（应该失败）')
  await sendUnsignedRequest('GET', '/api/cache?action=stats')

  // 测试3: 缓存预热（需要签名）
  console.log('\n🔥 测试3: 缓存预热')
  await sendSignedRequest('POST', '/api/cache', {
    action: 'warmup',
    data: { baseUrl: CONFIG.baseUrl }
  })

  // 测试4: 错误的签名（时间戳过期）
  console.log('\n⏰ 测试4: 过期时间戳（应该失败）')
  const expiredTimestamp = Math.floor(Date.now() / 1000) - 600 // 10分钟前
  const expiredNonce = generateNonce()
  const expiredSignature = generateSignature(
    CONFIG.secret,
    'GET',
    '/api/cache?action=stats',
    '',
    expiredTimestamp,
    expiredNonce
  )
  
  const expiredHeaders = {
    'Content-Type': 'application/json',
    [SIGNATURE_HEADERS.SIGNATURE]: expiredSignature,
    [SIGNATURE_HEADERS.TIMESTAMP]: expiredTimestamp.toString(),
    [SIGNATURE_HEADERS.NONCE]: expiredNonce,
    [SIGNATURE_HEADERS.KEY_ID]: CONFIG.keyId,
  }

  try {
    const response = await fetch(`${CONFIG.baseUrl}/api/cache?action=stats`, {
      method: 'GET',
      headers: expiredHeaders,
    })
    
    const responseData = await response.text()
    console.log(`📡 响应状态: ${response.status} ${response.statusText}`)
    console.log('响应内容:', responseData)
  } catch (error) {
    console.error('❌ 请求失败:', error.message)
  }

  // 测试5: 错误的密钥ID
  console.log('\n🔑 测试5: 错误的密钥ID（应该失败）')
  const wrongKeyHeaders = signRequest('wrong-key-id', CONFIG.secret, 'GET', '/api/cache?action=stats')
  
  try {
    const response = await fetch(`${CONFIG.baseUrl}/api/cache?action=stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...wrongKeyHeaders,
      },
    })
    
    const responseData = await response.text()
    console.log(`📡 响应状态: ${response.status} ${response.statusText}`)
    console.log('响应内容:', responseData)
  } catch (error) {
    console.error('❌ 请求失败:', error.message)
  }

  console.log('\n✅ 测试完成!')
}

// 命令行工具
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    await runTests()
    return
  }

  const command = args[0]
  
  switch (command) {
    case 'test':
      await runTests()
      break
      
    case 'sign':
      if (args.length < 3) {
        console.log('用法: node test-api-signature.js sign <method> <path> [body]')
        process.exit(1)
      }
      
      const method = args[1]
      const path = args[2]
      const body = args[3] ? JSON.parse(args[3]) : undefined
      
      await sendSignedRequest(method, path, body)
      break
      
    case 'generate':
      if (args.length < 3) {
        console.log('用法: node test-api-signature.js generate <method> <path> [body]')
        process.exit(1)
      }
      
      const genMethod = args[1]
      const genPath = args[2]
      const genBody = args[3] || ''
      
      const headers = signRequest(CONFIG.keyId, CONFIG.secret, genMethod, genPath, genBody)
      console.log('签名头部:')
      console.log(JSON.stringify(headers, null, 2))
      break
      
    default:
      console.log('可用命令:')
      console.log('  test     - 运行所有测试')
      console.log('  sign     - 发送签名请求')
      console.log('  generate - 生成签名头部')
      break
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  generateSignature,
  signRequest,
  sendSignedRequest,
}
