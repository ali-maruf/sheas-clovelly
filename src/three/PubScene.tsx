import { useMemo, useRef, type ReactNode, type RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { brass, easeOutBack, range } from './shared'

/*
 * THE PUB BUILDS ITSELF: an isometric architectural cutaway.
 * Each part drops into place in sequence (0 → 0.72), then the pendants and
 * terrace festoons switch on one by one (0.72 → 0.96).
 */

const timber = new THREE.MeshStandardMaterial({ color: '#4a2c17', roughness: 0.6 })
const timberLight = new THREE.MeshStandardMaterial({ color: '#7a4e2a', roughness: 0.5 })
const floorMat = new THREE.MeshStandardMaterial({ color: '#5b3a20', roughness: 0.75 })
const deckMat = new THREE.MeshStandardMaterial({ color: '#8a6440', roughness: 0.8 })
const wallMat = new THREE.MeshStandardMaterial({ color: '#18402f', roughness: 0.9 })
const wainscot = new THREE.MeshStandardMaterial({ color: '#0f2a20', roughness: 0.8 })
const leather = new THREE.MeshStandardMaterial({ color: '#2a120c', roughness: 0.55 })
const cream = new THREE.MeshStandardMaterial({ color: '#f6f0e1', roughness: 0.9 })
const leaf = new THREE.MeshStandardMaterial({ color: '#2e6b4e', roughness: 0.8 })
const bottleColors = ['#1f4d33', '#5a2a12', '#8f6f33', '#2b1a0f', '#3d5c2e', '#6b3b1e']

let ORDER = 0
const STEPS = 22 // number of assembling parts
const slot = () => ORDER++

/** A part that drops in from above during its slot of the build. */
function Part({ i, progress, children, from = 3 }: { i: number; progress: RefObject<number>; children: ReactNode; from?: number }) {
  const ref = useRef<THREE.Group>(null)
  const start = (i / STEPS) * 0.66
  useFrame(() => {
    const g = ref.current
    if (!g) return
    const t = range(progress.current ?? 0, start, start + 0.1)
    g.visible = t > 0.001
    const e = easeOutBack(t)
    g.position.y = (1 - e) * from
    g.scale.setScalar(0.92 + 0.08 * Math.min(1, e))
  })
  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  )
}

function Stool({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.42, 0]} material={brass}>
        <cylinderGeometry args={[0.04, 0.05, 0.84, 12]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={brass}>
        <torusGeometry args={[0.16, 0.02, 8, 24]} />
      </mesh>
      <mesh position={[0, 0.88, 0]} material={leather}>
        <cylinderGeometry args={[0.24, 0.22, 0.1, 24]} />
      </mesh>
    </group>
  )
}

function Table({ x, z, round = false }: { x: number; z: number; round?: boolean }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.74, 0]} material={timberLight}>
        {round ? <cylinderGeometry args={[0.5, 0.5, 0.06, 32]} /> : <boxGeometry args={[1.1, 0.06, 0.8]} />}
      </mesh>
      <mesh position={[0, 0.37, 0]} material={timber}>
        <cylinderGeometry args={[0.06, 0.18, 0.74, 12]} />
      </mesh>
      {[-0.75, 0.75].map((dz) => (
        <group key={dz} position={[0, 0, dz]}>
          <mesh position={[0, 0.45, 0]} material={timber}>
            <boxGeometry args={[0.45, 0.06, 0.42]} />
          </mesh>
          <mesh position={[0, 0.75, dz > 0 ? 0.2 : -0.2]} material={timber}>
            <boxGeometry args={[0.45, 0.6, 0.05]} />
          </mesh>
          {[-0.18, 0.18].map((lx) => (
            <mesh key={lx} position={[lx, 0.22, 0]} material={timber}>
              <boxGeometry args={[0.04, 0.44, 0.04]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function Umbrella({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.2, 0]} material={timber}>
        <cylinderGeometry args={[0.03, 0.03, 2.4, 8]} />
      </mesh>
      <mesh position={[0, 2.25, 0]} material={cream}>
        <coneGeometry args={[1.1, 0.45, 8, 1, true]} />
      </mesh>
    </group>
  )
}

/** Pendant light: shade + emissive bulb + point light, switched on by progress. */
function Pendant({ x, z, y = 2.7, on, progress, light = true }: { x: number; z: number; y?: number; on: number; progress: RefObject<number>; light?: boolean }) {
  const bulb = useRef<THREE.MeshStandardMaterial>(null)
  const pl = useRef<THREE.PointLight>(null)
  useFrame(() => {
    const t = range(progress.current ?? 0, on, on + 0.03)
    if (bulb.current) bulb.current.emissiveIntensity = t * 4
    if (pl.current) pl.current.intensity = t * 9
  })
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.2, 4]} />
        <meshStandardMaterial color="#120e0b" />
      </mesh>
      <mesh material={brass}>
        <coneGeometry args={[0.28, 0.3, 24, 1, true]} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshStandardMaterial ref={bulb} color="#fff1d6" emissive="#ffb766" emissiveIntensity={0} />
      </mesh>
      {light && <pointLight ref={pl} position={[0, -0.3, 0]} color="#ffb766" intensity={0} distance={5} decay={1.6} />}
    </group>
  )
}

function Festoon({ progress }: { progress: RefObject<number> }) {
  const bulbs = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 9; i++) {
      const z = -3.2 + i * 0.7
      const sag = Math.sin((i / 9) * Math.PI * 3) * 0.12
      pts.push([4.85, 2.4 - Math.abs(sag), z])
    }
    return pts
  }, [])
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  useFrame(() => {
    const p = progress.current ?? 0
    mats.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = range(p, 0.86 + i * 0.01, 0.875 + i * 0.01) * 5
    })
  })
  return (
    <group>
      {bulbs.map((b, i) => (
        <mesh key={i} position={b}>
          <sphereGeometry args={[0.06, 10, 8]} />
          <meshStandardMaterial ref={(m) => void (mats.current[i] = m)} color="#fff1d6" emissive="#ffc27a" emissiveIntensity={0} />
        </mesh>
      ))}
    </group>
  )
}

function Label({ position, show, children }: { position: [number, number, number]; show: boolean; children: ReactNode }) {
  return (
    <Html position={position} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <div
        aria-hidden="true"
        style={{
          opacity: show ? 1 : 0,
          transform: `translateY(${show ? 0 : 8}px)`,
          transition: 'opacity 700ms cubic-bezier(.65,0,.35,1), transform 700ms cubic-bezier(.22,.61,.36,1)',
          whiteSpace: 'nowrap',
          font: '600 11px/1 Inter Variable, Inter, sans-serif',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#f6f0e1',
          background: 'rgba(15,42,32,.82)',
          border: '1px solid rgba(201,164,92,.6)',
          padding: '8px 12px',
          borderRadius: 999,
        }}
      >
        {children}
      </div>
    </Html>
  )
}

function Ambient({ progress }: { progress: RefObject<number> }) {
  const amb = useRef<THREE.AmbientLight>(null)
  const sun = useRef<THREE.DirectionalLight>(null)
  useFrame(() => {
    // dusk falls as the lights come on
    const t = range(progress.current ?? 0, 0.7, 0.96)
    if (amb.current) amb.current.intensity = 0.9 - 0.5 * t
    if (sun.current) sun.current.intensity = 2.2 - 1.6 * t
  })
  return (
    <>
      <ambientLight ref={amb} color="#ffe9c9" intensity={0.9} />
      <directionalLight ref={sun} position={[6, 10, 4]} color="#fff0d8" intensity={2.2} />
      <hemisphereLight args={['#ffe2b8', '#0f2a20', 0.35]} />
    </>
  )
}

function Zoom() {
  const { size, camera } = useThree()
  const cam = camera as THREE.OrthographicCamera
  const zoom = Math.min(size.width / 13.5, size.height / 9.5)
  if (cam.zoom !== zoom) {
    cam.zoom = zoom
    cam.updateProjectionMatrix()
  }
  return null
}

function Pub({ progress, labels }: { progress: RefObject<number>; labels: boolean[] }) {
  ORDER = 0
  return (
    <group position={[-0.2, -1.1, 0]}>
      <Ambient progress={progress} />
      {/* shell */}
      <Part i={slot()} progress={progress} from={-2}>
        <mesh position={[-1.5, -0.1, 0]} material={floorMat}>
          <boxGeometry args={[7, 0.2, 7]} />
        </mesh>
      </Part>
      <Part i={slot()} progress={progress}>
        <mesh position={[-1.5, 1.6, -3.55]} material={wallMat}>
          <boxGeometry args={[7, 3.2, 0.1]} />
        </mesh>
        <mesh position={[-1.5, 0.5, -3.48]} material={wainscot}>
          <boxGeometry args={[7, 1, 0.06]} />
        </mesh>
        <mesh position={[-1.5, 1.02, -3.45]} material={brass}>
          <boxGeometry args={[7, 0.03, 0.03]} />
        </mesh>
      </Part>
      <Part i={slot()} progress={progress}>
        <mesh position={[-5.05, 1.6, 0]} material={wallMat}>
          <boxGeometry args={[0.1, 3.2, 7.2]} />
        </mesh>
        <mesh position={[-4.98, 0.5, 0]} material={wainscot}>
          <boxGeometry args={[0.06, 1, 7.2]} />
        </mesh>
        {/* windows */}
        {[-1.8, 1.4].map((z) => (
          <mesh key={z} position={[-4.97, 1.85, z]}>
            <boxGeometry args={[0.04, 1.1, 1.3]} />
            <meshStandardMaterial color="#e9c27a" emissive="#ffb766" emissiveIntensity={0.25} />
          </mesh>
        ))}
      </Part>
      {/* the bar */}
      <Part i={slot()} progress={progress}>
        <mesh position={[0.1, 0.55, -2.55]} material={timber}>
          <boxGeometry args={[3.6, 1.1, 0.75]} />
        </mesh>
        {[-1.2, -0.4, 0.4, 1.2].map((x) => (
          <mesh key={x} position={[0.1 + x, 0.55, -2.17]} material={timberLight}>
            <boxGeometry args={[0.6, 0.8, 0.02]} />
          </mesh>
        ))}
      </Part>
      <Part i={slot()} progress={progress}>
        <mesh position={[0.1, 1.13, -2.5]} material={timberLight}>
          <boxGeometry args={[3.8, 0.07, 0.95]} />
        </mesh>
      </Part>
      <Part i={slot()} progress={progress}>
        {/* brass foot rail */}
        <mesh position={[0.1, 0.22, -2.0]} rotation={[0, 0, Math.PI / 2]} material={brass}>
          <cylinderGeometry args={[0.035, 0.035, 3.6, 12]} />
        </mesh>
        {[-1.5, 0, 1.5].map((x) => (
          <mesh key={x} position={[0.1 + x, 0.12, -2.08]} rotation={[0.6, 0, 0]} material={brass}>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
          </mesh>
        ))}
      </Part>
      <Part i={slot()} progress={progress}>
        {/* taps */}
        {[-0.5, -0.2, 0.1, 0.4, 0.7].map((x) => (
          <group key={x} position={[x, 1.17, -2.6]}>
            <mesh position={[0, 0.2, 0]} material={brass}>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 10]} />
            </mesh>
            <mesh position={[0, 0.48, 0]}>
              <cylinderGeometry args={[0.025, 0.03, 0.18, 8]} />
              <meshStandardMaterial color="#120e0b" />
            </mesh>
          </group>
        ))}
      </Part>
      <Part i={slot()} progress={progress}>
        {/* back bar shelves */}
        {[1.5, 2.1].map((y) => (
          <mesh key={y} position={[0.1, y, -3.35]} material={timberLight}>
            <boxGeometry args={[3.4, 0.05, 0.3]} />
          </mesh>
        ))}
        {Array.from({ length: 22 }).map((_, i) => (
          <mesh key={i} position={[-1.45 + (i % 11) * 0.3, i < 11 ? 1.68 : 2.28, -3.35]}>
            <cylinderGeometry args={[0.05, 0.06, 0.32, 10]} />
            <meshStandardMaterial color={bottleColors[i % bottleColors.length]} roughness={0.15} metalness={0.1} />
          </mesh>
        ))}
      </Part>
      {[-1.1, -0.3, 0.5, 1.3].map((x) => (
        <Part key={x} i={slot()} progress={progress}>
          <Stool x={x} z={-1.75} />
        </Part>
      ))}
      {/* cosy restaurant */}
      <Part i={slot()} progress={progress}>
        <mesh position={[-3.2, 0.01, 0]}>
          <boxGeometry args={[3, 0.02, 5.5]} />
          <meshStandardMaterial color="#5a1f1a" roughness={1} />
        </mesh>
      </Part>
      <Part i={slot()} progress={progress}>
        <Table x={-3.4} z={-1.8} />
      </Part>
      <Part i={slot()} progress={progress}>
        <Table x={-3.4} z={1.1} />
      </Part>
      <Part i={slot()} progress={progress}>
        <Table x={-1.5} z={1.6} round />
      </Part>
      {/* outdoor terrace */}
      <Part i={slot()} progress={progress} from={-2}>
        <group position={[3.6, -0.12, 0]}>
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i} position={[0, 0, -3.3 + i * 0.6]} material={deckMat}>
              <boxGeometry args={[3.0, 0.12, 0.55]} />
            </mesh>
          ))}
        </group>
      </Part>
      <Part i={slot()} progress={progress}>
        {[-2.6, -0.9, 0.8, 2.5].map((z) => (
          <group key={z} position={[5.0, 0, z]}>
            <mesh position={[0, 0.3, 0]} material={timber}>
              <boxGeometry args={[0.45, 0.6, 1.2]} />
            </mesh>
            {[-0.35, 0, 0.35].map((dz) => (
              <mesh key={dz} position={[0, 0.75, dz]} material={leaf}>
                <sphereGeometry args={[0.28, 12, 10]} />
              </mesh>
            ))}
          </group>
        ))}
      </Part>
      <Part i={slot()} progress={progress}>
        <Table x={3.5} z={-1.6} round />
        <Umbrella x={3.5} z={-1.6} />
      </Part>
      <Part i={slot()} progress={progress}>
        <Table x={3.5} z={1.6} round />
        <Umbrella x={3.5} z={1.6} />
      </Part>
      <Part i={slot()} progress={progress}>
        {/* glazed doors between bar and terrace */}
        <mesh position={[2.05, 1.3, -2.2]}>
          <boxGeometry args={[0.06, 2.6, 2.4]} />
          <meshStandardMaterial color="#c8e0d4" transparent opacity={0.18} roughness={0.05} />
        </mesh>
        <mesh position={[2.05, 2.62, -2.2]} material={timber}>
          <boxGeometry args={[0.1, 0.08, 2.4]} />
        </mesh>
      </Part>

      {/* lights, one by one */}
      <Pendant x={-0.6} z={-2.4} on={0.74} progress={progress} />
      <Pendant x={0.8} z={-2.4} on={0.775} progress={progress} />
      <Pendant x={-3.4} z={-1.8} on={0.81} progress={progress} />
      <Pendant x={-3.4} z={1.1} on={0.835} progress={progress} />
      <Pendant x={-1.5} z={1.6} on={0.85} progress={progress} light={false} />
      <Festoon progress={progress} />

      <Label position={[-3.4, 2.4, 0]} show={labels[0]}>
        Cosy restaurant
      </Label>
      <Label position={[3.6, 3.0, 0]} show={labels[1]}>
        Outdoor terrace
      </Label>
      <Label position={[0.1, 3.2, -2.4]} show={labels[2]}>
        The bar
      </Label>
    </group>
  )
}

export default function PubScene({
  progress,
  active,
  labels,
  onReady,
}: {
  progress: RefObject<number>
  active: boolean
  labels: boolean[]
  onReady?: () => void
}) {
  return (
    <Canvas
      orthographic
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [10, 8.5, 10], zoom: 60, near: -50, far: 100 }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 0, 0)
        requestAnimationFrame(() => onReady?.())
      }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <Zoom />
      <Pub progress={progress} labels={labels} />
    </Canvas>
  )
}
