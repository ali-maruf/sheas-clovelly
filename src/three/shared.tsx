import * as THREE from 'three'
import { Environment, Lightformer } from '@react-three/drei'

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/** Maps p from [a, b] to [0, 1], clamped. */
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
/** Slight overshoot, like something set down with weight. */
export const easeOutBack = (t: number) => {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

export const brass = new THREE.MeshStandardMaterial({ color: '#c9a45c', metalness: 1, roughness: 0.28 })
export const brassDark = new THREE.MeshStandardMaterial({ color: '#8f6f33', metalness: 1, roughness: 0.4 })

/** Studio-free warm pub lighting for reflections (no network HDR). */
export function PubEnvironment({ intensity = 1 }: { intensity?: number }) {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#120e0b']} />
      <Lightformer form="rect" intensity={2.2 * intensity} color="#ffd9a0" position={[0, 4, -4]} scale={[8, 2, 1]} />
      <Lightformer form="rect" intensity={1.4 * intensity} color="#ffb766" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} />
      <Lightformer form="rect" intensity={0.8 * intensity} color="#9fd3b6" position={[5, 1, 0]} rotation-y={-Math.PI / 2} scale={[3, 6, 1]} />
      <Lightformer form="circle" intensity={3 * intensity} color="#fff1d6" position={[0, 6, 2]} scale={2} />
    </Environment>
  )
}
