"use client"

import { PropsWithChildren, useEffect, useState } from 'react'

interface DeferredScriptsProps extends PropsWithChildren {
  /**
   * Optional delay (in ms) used when requestIdleCallback is unavailable.
   * Defaults to 3000ms to avoid competing with the initial rendering work.
   */
  idleDelay?: number
}

/**
 * Defers rendering of child script components until the browser is idle
 * or the user has interacted with the page. This keeps third-party scripts
 * off the critical rendering path and improves LCP/FCP.
 */
export function DeferredScripts({ children, idleDelay = 3000 }: DeferredScriptsProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (shouldRender) {
      return
    }

    let idleHandle: number | null = null
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll']

    const triggerRender = () => setShouldRender(true)

    const scheduleIdleRender = () => {
      if (typeof window === 'undefined' || shouldRender) {
        return
      }

      if ('requestIdleCallback' in window) {
        idleHandle = (window as any).requestIdleCallback(() => {
          setShouldRender(true)
        }, { timeout: idleDelay })
      } else {
        idleHandle = window.setTimeout(() => {
          setShouldRender(true)
        }, idleDelay)
      }
    }

    scheduleIdleRender()
    events.forEach((event) => {
      window.addEventListener(event, triggerRender, { once: true, passive: true })
    })

    return () => {
      if (idleHandle !== null) {
        if ('cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(idleHandle)
        } else {
          window.clearTimeout(idleHandle)
        }
      }
      events.forEach((event) => {
        window.removeEventListener(event, triggerRender)
      })
    }
  }, [idleDelay, shouldRender])

  if (!shouldRender) {
    return null
  }

  return <>{children}</>
}
