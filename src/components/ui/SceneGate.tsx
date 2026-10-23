import { Component, Suspense, useState, type ReactNode } from 'react'
import { useDeferredStart, useMotionMode } from '../../lib/motion'
import { useInView } from '../../lib/useInView'

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Lazy-mounts a WebGL scene only when it is near the viewport, in full-motion
 * mode, and (optionally) after the first interaction. Pauses it off-screen.
 * The baked still is always rendered underneath and cross-fades out.
 */
export function SceneGate({
  still,
  render,
  deferUntilInteraction = false,
  className = 'absolute inset-0',
}: {
  still: ReactNode
  render: (active: boolean, onReady: () => void) => ReactNode
  deferUntilInteraction?: boolean
  className?: string
}) {
  const mode = useMotionMode()
  const [nearRef, near] = useInView<HTMLDivElement>('60% 0px', true)
  const [activeRef, active] = useInView<HTMLDivElement>('10% 0px')
  const started = useDeferredStart()
  const mount = mode === 'full' && near && (!deferUntilInteraction || started)
  const [ready, setReady] = useState(false)

  return (
    <div ref={nearRef} className={className}>
      <div ref={activeRef} className="absolute inset-0">
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: mount && ready ? 0 : 1 }}>
          {still}
        </div>
        {mount && (
          <SceneBoundary fallback={null}>
            <Suspense fallback={null}>
              <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
                {render(active, () => setReady(true))}
              </div>
            </Suspense>
          </SceneBoundary>
        )}
      </div>
    </div>
  )
}
