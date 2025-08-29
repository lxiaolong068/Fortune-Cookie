/**
 * 全局加载骨架屏组件
 * 在页面路由切换时显示，提升用户体验
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* 主内容区域骨架屏 */}
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* 页面标题骨架屏 */}
        <div className="text-center mb-12">
          <div className="w-64 h-12 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="w-96 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>

        {/* 主要内容骨架屏 */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-6 shadow-sm"
              >
                {/* 卡片标题骨架屏 */}
                <div className="w-32 h-6 bg-gray-200 rounded mb-4 animate-pulse" />
                
                {/* 卡片内容骨架屏 */}
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* 卡片按钮骨架屏 */}
                <div className="w-24 h-8 bg-gray-200 rounded mt-4 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* 底部操作区域骨架屏 */}
        <div className="text-center mt-12">
          <div className="w-32 h-10 bg-gray-200 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      {/* 浮动装饰元素 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-amber-300/30 rounded-full animate-pulse"
            style={{
              left: `${20 + index * 30}%`,
              top: `${30 + index * 20}%`,
              animationDelay: `${index * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
