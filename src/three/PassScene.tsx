import { useMemo, useRef, type ReactNode, type RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, RoundedBox } from '@react-three/drei'
import { brass, easeInOut, easeOutBack, PubEnvironment, range } from './shared'
import { PLATE_WINDOWS, PLATE_X } from './passTiming'

/*
 * PUB CLASSICS ON THE PASS. Plates slide in from the right one after another,
 * land with a little weight (overshoot + wobble) and start to steam.
 */

const ceramic = new THREE.MeshPhysicalMaterial({ color: '#fbf7ee', roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.15 })
const m = (color: string, roughness = 0.6, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, ...extra })
const eggWhite = m('#f7f2e6', 0.45)
const yolk = m('#f0a01c', 0.25)
const toast = m('#c98d4a', 0.85)
const bacon = m('#a5473a', 0.55)
const tomato = m('#b8321f', 0.35)
const mushroom = m('#6b4a33', 0.7)
const muffin = m('#d9b27a', 0.85)
const ham = m('#d98a83', 0.6)
const hollandaise = m('#f2c443', 0.3)
const greens = m('#3d7a3a', 0.7)
const steakMat = m('#5a2e1a', 0.7)
const charMat = m('#1e0f08', 0.9)
const chipMat = m('#e3b45c', 0.7)
const gravy = m('#3a1d0e', 0.2)

function usePlateGeometry(radius = 0.95) {
  return useMemo(() => {
    const pts = [
      [0, 0],
      [radius * 0.62, 0],
      [radius * 0.66, 0.05],
      [radius * 0.7, 0.07],
      [radius * 0.92, 0.12],
      [radius, 0.16],
      [radius * 0.99, 0.18],
      [radius * 0.9, 0.15],
      [radius * 0.68, 0.1],
      [0, 0.1],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(pts, 64)
  }, [radius])
}

function Breakfast() {
  return (
    <group position={[0, 0.1, 0]}>
      {[
        [-0.28, -0.12],
        [0.12, -0.32],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh material={eggWhite} scale={[1, 0.25, 0.85]}>
            <sphereGeometry args={[0.3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh material={yolk} position={[0.03, 0.04, 0]} scale={[1, 0.65, 1]}>
            <sphereGeometry args={[0.11, 20, 14]} />
          </mesh>
        </group>
      ))}
      {[0, 1].map((i) => (
        <mesh key={i} material={bacon} position={[0.42, 0.04 + i * 0.03, 0.12 + i * 0.12]} rotation={[0, 0.5, 0.06]}>
          <boxGeometry args={[0.62, 0.035, 0.13]} />
        </mesh>
      ))}
      {[0, 1].map((i) => (
        <mesh key={i} material={toast} position={[-0.35 + i * 0.08, 0.06 + i * 0.07, 0.34 - i * 0.04]} rotation={[0.1, 0.4, i * 0.15]}>
          <boxGeometry args={[0.42, 0.07, 0.42]} />
        </mesh>
      ))}
      {[0, 1].map((i) => (
        <mesh key={i} material={tomato} position={[0.4 - i * 0.18, 0.02, -0.38 + i * 0.05]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} material={mushroom} position={[0.15 + i * 0.12, 0.02, 0.45 - i * 0.05]} scale={[1, 0.6, 1]}>
          <sphereGeometry args={[0.08, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      ))}
    </group>
  )
}

function Benedict() {
  return (
    <group position={[0, 0.1, 0]}>
      {[-0.27, 0.27].map((x) => (
        <group key={x} position={[x, 0, -0.05]}>
          <mesh material={muffin} position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.28, 0.27, 0.12, 28]} />
          </mesh>
          <mesh material={ham} position={[0, 0.135, 0]} rotation={[0.05, 0, 0.04]}>
            <cylinderGeometry args={[0.3, 0.3, 0.03, 28]} />
          </mesh>
          <mesh material={eggWhite} position={[0, 0.2, 0]} scale={[1, 0.55, 1]}>
            <sphereGeometry args={[0.24, 24, 16]} />
          </mesh>
          <mesh material={hollandaise} position={[0, 0.26, 0]} scale={[1, 0.38, 1]}>
            <sphereGeometry args={[0.235, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} material={greens} position={[-0.06 + i * 0.06, 0.35, 0.02 * i]} rotation={[0, i, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.09, 4]} />
            </mesh>
          ))}
        </group>
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} material={greens} position={[-0.3 + i * 0.1, 0.03, 0.42 + Math.sin(i) * 0.05]} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[0.08, 10, 8]} />
        </mesh>
      ))}
    </group>
  )
}

function Steak() {
  return (
    <group position={[0, 0.1, 0]}>
      <group position={[-0.12, 0.1, -0.05]} rotation={[0, 0.35, 0]}>
        <RoundedBox args={[0.95, 0.2, 0.6]} radius={0.08} smoothness={3} material={steakMat} />
        {[-0.28, -0.08, 0.12, 0.32].map((x) => (
          <mesh key={x} material={charMat} position={[x, 0.101, 0]} rotation={[0, 0.7, 0]}>
            <boxGeometry args={[0.035, 0.005, 0.62]} />
          </mesh>
        ))}
      </group>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh
          key={i}
          material={chipMat}
          position={[0.45 + (i % 3) * 0.07, 0.05 + Math.floor(i / 3) * 0.075, 0.3 - (i % 3) * 0.04]}
          rotation={[0, -0.5 + i * 0.08, 0]}
        >
          <boxGeometry args={[0.07, 0.07, 0.5]} />
        </mesh>
      ))}
      <group position={[-0.45, 0, 0.42]}>
        <mesh material={brass} position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.13, 0.11, 0.18, 24, 1, true]} />
        </mesh>
        <mesh material={gravy} position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.125, 0.125, 0.01, 24]} />
        </mesh>
      </group>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} material={greens} position={[0.15 + i * 0.07, 0.03, -0.45 + (i % 2) * 0.06]} scale={[1, 0.6, 1]}>
          <sphereGeometry args={[0.06, 10, 8]} />
        </mesh>
      ))}
    </group>
  )
}

const steamTexture = (() => {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,0.55)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
})()

function Steam({ strength }: { strength: RefObject<number> }) {
  const COUNT = 14
  const points = useRef<THREE.Points>(null)
  const seeds = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({ x: (Math.random() - 0.5) * 0.7, z: (Math.random() - 0.5) * 0.5, o: i / COUNT })), [])
  const positions = useMemo(() => new Float32Array(COUNT * 3), [])
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.22
    seeds.forEach((s, i) => {
      const life = (t + s.o) % 1
      positions[i * 3] = s.x + Math.sin(life * 6 + i) * 0.08
      positions[i * 3 + 1] = 0.35 + life * 1.5
      positions[i * 3 + 2] = s.z
    })
    const pts = points.current
    if (pts) {
      pts.geometry.attributes.position.needsUpdate = true
      ;(pts.material as THREE.PointsMaterial).opacity = 0.32 * (strength.current ?? 0)
    }
  })
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={steamTexture ?? undefined} size={0.55} transparent depthWrite={false} opacity={0} color="#ffffff" />
    </points>
  )
}

function Plate({ index, progress, children }: { index: number; progress: RefObject<number>; children: ReactNode }) {
  const geo = usePlateGeometry()
  const ref = useRef<THREE.Group>(null)
  const steam = useRef(0)
  const [a, b] = PLATE_WINDOWS[index]
  useFrame(() => {
    const t = range(progress.current ?? 0, a, b)
    const e = easeOutBack(t)
    const g = ref.current
    if (!g) return
    g.visible = t > 0
    g.position.x = PLATE_X[index] + (1 - e) * 9
    // weight: a slight tilt as it slides, settling flat on arrival
    g.rotation.z = (1 - t) * 0.04 + Math.sin(t * Math.PI) * -0.02
    g.rotation.y = (1 - e) * 0.6
    steam.current = range(progress.current ?? 0, b - 0.04, b + 0.08)
  })
  return (
    <group ref={ref} visible={false}>
      <mesh geometry={geo} material={ceramic} />
      {children}
      <Steam strength={steam} />
    </group>
  )
}

function Pass() {
  return (
    <group>
      <RoundedBox args={[10, 0.32, 2.2]} radius={0.04} smoothness={2} position={[0, -0.16, 0]}>
        <meshStandardMaterial color="#5a3519" roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, -0.02, 1.08]} rotation={[0, 0, Math.PI / 2]} material={brass}>
        <cylinderGeometry args={[0.03, 0.03, 10, 12]} />
      </mesh>
      {/* heat lamp gantry */}
      <mesh position={[0, 2.4, -0.2]} material={brass}>
        <boxGeometry args={[9.6, 0.14, 0.5]} />
      </mesh>
      {PLATE_X.map((x) => (
        <mesh key={x} position={[x, 2.31, -0.2]}>
          <boxGeometry args={[1.6, 0.03, 0.36]} />
          <meshStandardMaterial color="#ffcf8a" emissive="#ff9a4a" emissiveIntensity={2.2} />
        </mesh>
      ))}
    </group>
  )
}

function Rig({ progress }: { progress: RefObject<number> }) {
  const { camera, size } = useThree()
  const narrow = size.width / size.height < 1.1
  useFrame(() => {
    const p = progress.current ?? 0
    // on narrow screens follow the latest plate along the pass
    let x = 0
    if (narrow) {
      const seg = p < PLATE_WINDOWS[1][0] ? 0 : p < PLATE_WINDOWS[2][0] ? 1 : 2
      const prev = PLATE_X[Math.max(0, seg - 1)]
      const t = seg === 0 ? 1 : easeInOut(range(p, PLATE_WINDOWS[seg][0], PLATE_WINDOWS[seg][0] + 0.12))
      x = THREE.MathUtils.lerp(prev, PLATE_X[seg], t)
    }
    camera.position.x += (x - camera.position.x) * 0.12
    camera.position.y = narrow ? 3.4 : 3.1
    camera.position.z = narrow ? 5.2 : 6.6
    camera.lookAt(camera.position.x, 0.1, 0)
  })
  return null
}

export default function PassScene({ progress, active, onReady }: { progress: RefObject<number>; active: boolean; onReady?: () => void }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 35, position: [0, 3.1, 6.6] }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.4} color="#ffe6c4" />
      <spotLight position={[0, 5, 1]} angle={0.9} penumbra={0.9} intensity={70} color="#ffc98a" />
      <directionalLight position={[-4, 6, 5]} intensity={1.2} color="#fff0dc" />
      <PubEnvironment intensity={0.7} />
      <Rig progress={progress} />
      <Pass />
      <Plate index={0} progress={progress}>
        <Breakfast />
      </Plate>
      <Plate index={1} progress={progress}>
        <Benedict />
      </Plate>
      <Plate index={2} progress={progress}>
        <Steak />
      </Plate>
      <ContactShadows position={[0, 0.005, 0]} scale={10} width={10} height={3} blur={2.2} opacity={0.65} far={1.2} resolution={512} color="#120e0b" />
    </Canvas>
  )
}
