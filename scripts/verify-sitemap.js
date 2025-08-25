#!/usr/bin/env node

/**
 * 验证 sitemap.xml 中的所有页面是否可以正常访问
 * 这个脚本会检查项目中的所有页面路由是否与 sitemap 中的 URL 匹配
 */

const fs = require('fs')
const path = require('path')

// 从 sitemap.ts 中提取的页面列表
const sitemapPages = [
  '/',
  '/generator',
  '/messages',
  '/browse',
  '/history',
  '/recipes',
  '/who-invented-fortune-cookies',
  '/how-to-make-fortune-cookies',
  '/funny-fortune-cookie-messages',
  '/profile'
]

// 不应该包含在 sitemap 中的页面（设置了 noindex 或功能性页面）
const excludedPages = [
  '/analytics',  // 设置了 robots: 'noindex, nofollow'
  '/offline',    // 设置了 robots: 'noindex, nofollow'
]

// 检查 app 目录中的实际页面
function getActualPages() {
  const appDir = path.join(process.cwd(), 'app')
  const pages = []
  
  // 递归扫描 app 目录
  function scanDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        // 跳过特殊目录
        if (item.startsWith('(') || item === 'api' || item === 'admin') {
          continue
        }
        
        const currentPath = basePath + '/' + item
        
        // 检查是否有 page.tsx 文件
        const pageFile = path.join(fullPath, 'page.tsx')
        if (fs.existsSync(pageFile)) {
          pages.push(currentPath)
        }
        
        // 递归扫描子目录
        scanDirectory(fullPath, currentPath)
      }
    }
  }
  
  // 检查根页面
  const rootPageFile = path.join(appDir, 'page.tsx')
  if (fs.existsSync(rootPageFile)) {
    pages.push('/')
  }
  
  scanDirectory(appDir)
  return pages.sort()
}

// 验证函数
function verifySitemap() {
  console.log('🔍 验证 sitemap.xml 页面完整性...\n')
  
  const actualPages = getActualPages()
  const sitemapSet = new Set(sitemapPages)
  const actualSet = new Set(actualPages)
  
  console.log('📄 Sitemap 中的页面:')
  sitemapPages.forEach(page => {
    console.log(`  ✓ ${page}`)
  })
  
  console.log('\n📁 项目中的实际页面:')
  actualPages.forEach(page => {
    console.log(`  ✓ ${page}`)
  })
  
  // 检查缺失的页面（排除不应该包含在 sitemap 中的页面）
  const missingInSitemap = actualPages.filter(page =>
    !sitemapSet.has(page) && !excludedPages.includes(page)
  )
  const missingInProject = sitemapPages.filter(page => !actualSet.has(page))
  
  console.log('\n📊 验证结果:')
  
  if (missingInSitemap.length > 0) {
    console.log('\n⚠️  以下页面存在于项目中但未包含在 sitemap 中:')
    missingInSitemap.forEach(page => {
      console.log(`  ❌ ${page}`)
    })
  }
  
  if (missingInProject.length > 0) {
    console.log('\n⚠️  以下页面在 sitemap 中但项目中不存在:')
    missingInProject.forEach(page => {
      console.log(`  ❌ ${page}`)
    })
  }
  
  if (missingInSitemap.length === 0 && missingInProject.length === 0) {
    console.log('✅ 所有页面都已正确包含在 sitemap 中!')
    console.log(`\n📝 已排除的页面 (noindex 或功能性页面):`)
    excludedPages.forEach(page => {
      console.log(`  ⚪ ${page}`)
    })
  }
  
  console.log(`\n📈 统计信息:`)
  console.log(`  - Sitemap 页面数: ${sitemapPages.length}`)
  console.log(`  - 项目页面数: ${actualPages.length}`)
  console.log(`  - 匹配页面数: ${sitemapPages.filter(page => actualSet.has(page)).length}`)
  
  return missingInSitemap.length === 0 && missingInProject.length === 0
}

// 运行验证
if (require.main === module) {
  const isValid = verifySitemap()
  process.exit(isValid ? 0 : 1)
}

module.exports = { verifySitemap, getActualPages }
