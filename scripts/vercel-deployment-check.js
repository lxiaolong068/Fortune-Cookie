#!/usr/bin/env node

/**
 * Vercel 部署状态检查脚本
 * 用于验证 Vercel 部署后的应用状态
 */

const https = require('https');
const http = require('http');

// 配置
const config = {
  url: process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: 3,
  retryDelay: 5000
};

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// HTTP 请求函数
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: config.timeout,
      headers: {
        'User-Agent': 'Vercel-Deployment-Check/1.0',
        ...options.headers
      },
      ...options
    };

    const req = client.get(url, requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${config.timeout}ms`));
    });
  });
}

// 重试机制
async function makeRequestWithRetry(url, options = {}) {
  for (let i = 0; i < config.retries; i++) {
    try {
      return await makeRequest(url, options);
    } catch (error) {
      if (i === config.retries - 1) {
        throw error;
      }
      logWarning(`请求失败，${config.retryDelay/1000}秒后重试... (${i + 1}/${config.retries})`);
      await new Promise(resolve => setTimeout(resolve, config.retryDelay));
    }
  }
}

// 检查项目
const checks = [
  {
    name: '主页访问',
    path: '/',
    validate: (response) => {
      return response.statusCode === 200 && 
             response.data.includes('Fortune Cookie AI') &&
             response.data.includes('<!DOCTYPE html>');
    }
  },
  {
    name: 'AI 生成器页面',
    path: '/generator',
    validate: (response) => {
      return response.statusCode === 200 && 
             response.data.includes('AI Fortune Cookie Generator');
    }
  },
  {
    name: '幸运饼干浏览页面',
    path: '/browse',
    validate: (response) => {
      return response.statusCode === 200;
    }
  },
  {
    name: 'API - 获取幸运饼干',
    path: '/api/fortune',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ category: 'general' }),
    validate: (response) => {
      if (response.statusCode !== 200) return false;
      try {
        const data = JSON.parse(response.data);
        return data.message && typeof data.message === 'string';
      } catch {
        return false;
      }
    }
  },
  {
    name: 'API - 获取所有消息',
    path: '/api/fortunes',
    validate: (response) => {
      if (response.statusCode !== 200) return false;
      try {
        const data = JSON.parse(response.data);
        return Array.isArray(data.messages) && data.messages.length > 0;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'Sitemap',
    path: '/sitemap.xml',
    validate: (response) => {
      return response.statusCode === 200 && 
             response.data.includes('<?xml') &&
             response.data.includes('<urlset');
    }
  },
  {
    name: 'Robots.txt',
    path: '/robots.txt',
    validate: (response) => {
      return response.statusCode === 200 && 
             response.data.includes('User-agent');
    }
  },
  {
    name: 'Manifest',
    path: '/manifest.json',
    validate: (response) => {
      if (response.statusCode !== 200) return false;
      try {
        const data = JSON.parse(response.data);
        return data.name && data.icons;
      } catch {
        return false;
      }
    }
  }
];

// 主检查函数
async function runChecks() {
  log(`${colors.bold}🚀 Vercel 部署状态检查${colors.reset}`);
  log(`目标 URL: ${config.url}`);
  log('');

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      logInfo(`检查: ${check.name}`);
      
      const url = `${config.url}${check.path}`;
      const options = {
        method: check.method || 'GET',
        headers: check.headers || {}
      };

      const response = await makeRequestWithRetry(url, options);
      
      if (check.validate(response)) {
        logSuccess(`${check.name} - 通过`);
        passed++;
      } else {
        logError(`${check.name} - 失败 (状态码: ${response.statusCode})`);
        failed++;
      }
    } catch (error) {
      logError(`${check.name} - 错误: ${error.message}`);
      failed++;
    }
    
    log('');
  }

  // 总结
  log(`${colors.bold}📊 检查结果总结${colors.reset}`);
  log(`✅ 通过: ${passed}`);
  log(`❌ 失败: ${failed}`);
  log(`📈 成功率: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    logSuccess('🎉 所有检查都通过了！部署成功！');
    process.exit(0);
  } else {
    logError('❌ 部分检查失败，请检查部署配置');
    process.exit(1);
  }
}

// 运行检查
if (require.main === module) {
  runChecks().catch((error) => {
    logError(`检查过程中发生错误: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runChecks, makeRequest, checks };
