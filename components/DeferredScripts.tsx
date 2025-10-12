"use client"

import { PropsWithChildren, useEffect, useState } from 'react'

interface DeferredScriptsProps extends PropsWithChildren {
  /**
   * Optional delay (in ms) used when requestIdleCallback is unavailable.
   * Defaults to 3000ms to avoid competing with the initial rendering work.
   */
  idleDelay?: number
}

type RequestIdleCallback = (callback: () => void, options?: { timeout?: number }) => number
type CancelIdleCallback = (handle: number) => void

/**
 * Defers rendering of child script components until the browser is idle
 * or the user has interacted with the page. This keeps third-party scripts
 * off the critical rendering path and improves LCP/FCP.
 */
export function DeferredScripts({ children, idleDelay = 3000 }: DeferredScriptsProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      // No-op during SSR; scripts will render on client hydration pass.
      return
    }

    if (shouldRender) {
      return
    }

    type TimeoutHandle = ReturnType<typeof setTimeout>
    let idleHandle: number | TimeoutHandle | null = null
    let handleType: 'idle' | 'timeout' | null = null

    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll']

    const triggerRender = () => setShouldRender(true)

    const scheduleIdleRender = () => {
      if (typeof window === 'undefined' || shouldRender) {
        return
      }

      const requestIdle = (window as typeof window & {
        requestIdleCallback?: RequestIdleCallback
      }).requestIdleCallback

      if (typeof requestIdle === 'function') {
        idleHandle = requestIdle(() => {
          setShouldRender(true)
        }, { timeout: idleDelay })
        handleType = 'idle'
      } else {
        idleHandle = setTimeout(() => {
          setShouldRender(true)
        }, idleDelay)
        handleType = 'timeout'
      }
    }

    scheduleIdleRender()
    events.forEach((event) => {
      window.addEventListener(event, triggerRender, { once: true, passive: true })
    })

    return () => {
      if (idleHandle !== null) {
        if (handleType === 'idle' && typeof window !== 'undefined') {
          const cancelIdle = (window as typeof window & {
            cancelIdleCallback?: CancelIdleCallback
          }).cancelIdleCallback
          if (typeof cancelIdle === 'function') {
            cancelIdle(idleHandle as number)
          }
        }

        if (handleType === 'timeout') {
          clearTimeout(idleHandle as TimeoutHandle)
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
