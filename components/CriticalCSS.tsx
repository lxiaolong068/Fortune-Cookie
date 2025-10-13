/**
 * Critical CSS for above-the-fold content
 * Inlined in <head> to eliminate render-blocking CSS and improve LCP
 * 
 * This includes only the essential styles needed for the initial viewport:
 * - Layout structure (flexbox, grid)
 * - Typography (font-family, sizes)
 * - Colors (background, text)
 * - Critical animations (fade-in)
 * 
 * Non-critical styles (hover effects, complex animations) are loaded separately
 */
export function CriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical layout styles */
          *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
          html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
          body{margin:0;line-height:inherit}
          
          /* Critical typography */
          h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
          
          /* Critical utility classes for above-the-fold content */
          .min-h-screen{min-height:100vh}
          .flex{display:flex}
          .flex-col{flex-direction:column}
          .items-center{align-items:center}
          .justify-center{justify-content:center}
          .text-center{text-align:center}
          .relative{position:relative}
          .absolute{position:absolute}
          .z-10{z-index:10}
          
          /* Critical spacing */
          .p-6{padding:1.5rem}
          .mb-3{margin-bottom:0.75rem}
          .mb-4{margin-bottom:1rem}
          .mb-6{margin-bottom:1.5rem}
          .space-y-3>:not([hidden])~:not([hidden]){margin-top:0.75rem}
          .space-y-6>:not([hidden])~:not([hidden]){margin-top:1.5rem}
          .gap-3{gap:0.75rem}
          
          /* Critical sizing */
          .w-full{width:100%}
          .w-32{width:8rem}
          .h-32{height:8rem}
          .h-2{height:0.5rem}
          .max-w-2xl{max-width:42rem}
          .min-h-\\[600px\\]{min-height:600px}
          
          /* Critical colors - Fortune Cookie theme */
          .bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}
          .from-orange-50\\/80{--tw-gradient-from:rgb(255 247 237 / 0.8);--tw-gradient-to:rgb(255 247 237 / 0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
          .to-amber-100\\/80{--tw-gradient-to:rgb(254 243 199 / 0.8)}
          .bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
          .from-amber-700{--tw-gradient-from:#b45309;--tw-gradient-to:rgb(180 83 9 / 0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
          .via-yellow-600{--tw-gradient-to:rgb(202 138 4 / 0);--tw-gradient-stops:var(--tw-gradient-from),#ca8a04,var(--tw-gradient-to)}
          .to-orange-700{--tw-gradient-to:#c2410c}
          .from-yellow-200{--tw-gradient-from:#fef08a;--tw-gradient-to:rgb(254 240 138 / 0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
          .to-amber-300{--tw-gradient-to:#fcd34d}
          .from-amber-400{--tw-gradient-from:#fbbf24;--tw-gradient-to:rgb(251 191 36 / 0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
          .to-orange-400{--tw-gradient-to:#fb923c}
          .bg-amber-200{background-color:#fde68a}
          .text-amber-700{color:#b45309}
          .text-amber-600\\/90{color:rgb(217 119 6 / 0.9)}
          .text-transparent{color:transparent}
          .bg-clip-text{-webkit-background-clip:text;background-clip:text}
          .border-amber-300{border-color:#fcd34d}
          .border-amber-400\\/50{border-color:rgb(251 191 36 / 0.5)}
          .border-amber-400\\/30{border-color:rgb(251 191 36 / 0.3)}
          
          /* Critical typography sizes */
          .text-3xl{font-size:1.875rem;line-height:2.25rem}
          .text-sm{font-size:0.875rem;line-height:1.25rem}
          .font-semibold{font-weight:600}
          
          /* Critical visual effects */
          .rounded-full{border-radius:9999px}
          .shadow-lg{box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1),0 4px 6px -4px rgb(0 0 0 / 0.1)}
          .border-2{border-width:2px}
          .overflow-hidden{overflow:hidden}
          .overflow-x-hidden{overflow-x:hidden}
          .backdrop-blur-sm{backdrop-filter:blur(4px)}
          
          /* Critical animation - simple fade-in */
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          .animate-fade-in{animation:fadeIn 0.3s ease-out}
          
          /* Critical animation - pulse for loading */
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
          .animate-pulse{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}
          
          /* Screen reader only utility */
          .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
          
          /* Prevent layout shift during font loading */
          body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif}
        `,
      }}
    />
  )
}

