"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Sparkles, MessageSquare, Clock, ChefHat, Search } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Generate fortune cookies'
  },
  {
    name: 'Generator',
    href: '/generator',
    icon: Sparkles,
    description: 'AI-powered generator'
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    description: 'Browse fortune messages'
  },
  {
    name: 'Browse',
    href: '/browse',
    icon: Search,
    description: 'Search & filter fortunes'
  },
  {
    name: 'History',
    href: '/history',
    icon: Clock,
    description: 'Learn the origins'
  },
  {
    name: 'Recipes',
    href: '/recipes',
    icon: ChefHat,
    description: 'Make your own'
  }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* 桌面导航 */}
      <nav className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md rounded-full border border-amber-200 shadow-lg px-6 py-3"
        >
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2",
                      isActive 
                        ? "bg-amber-100 text-amber-700" 
                        : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-amber-100 rounded-full -z-10"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </nav>

      {/* 移动端导航 */}
      <div className="md:hidden">
        {/* 汉堡菜单按钮 */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-md border-amber-200 hover:bg-amber-50"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* 移动端菜单覆盖层 */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md border-l border-amber-200 shadow-xl z-50 p-6"
              >
                <div className="mt-16 space-y-4">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-lg transition-all duration-200",
                            isActive
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm opacity-70">{item.description}</div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* 移动端底部装饰 */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="inline-block mb-2"
                    >
                      <Sparkles className="w-6 h-6 text-amber-500" />
                    </motion.div>
                    <p className="text-sm text-gray-500">
                      Fortune Cookie AI
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
