import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { brass, brassDark, easeInOut, easeOut, PubEnvironment, range } from './shared'
import { SHAMROCK_LEAF_PATH } from '../components/ui/Shamrock'

/*
 * THE PERFECT POUR, scroll-scrubbed.
 *   0.00–0.35  glass tilts from 45° to upright under the tap
 *   0.05–0.40  first pour to three-quarters, full surge
 *   0.40–0.62  the surge settles from the bottom up; head begins
 *   0.62–0.80  top-up to the rim; head forms
 *   0.82–0.95  shamrock appears in the foam
 *   0.78–1.00  camera eases in over the head
 * Everything derives from progress, so it reverses cleanly.
 */

const BOTTOM = -1.15 // inner base of the glass (local)
const RIM = 1.26 // inner rim (local)
const FIRST_POUR = 0.78 // three-quarters
const FULL = 1.22

// Tulip pint profile (radius, y) – outer wall bottom → rim.
const OUTER: [number, number][] = [
  [0.0, -1.3],
  [0.47, -1.3],
  [0.5, -1.26],
  [0.5, -1.0],
  [0.53, -0.4],
  [0.6, 0.3],
  [0.69, 0.85],
  [0.71, 1.08],
  [0.69, 1.3],
]

function innerRadiusAt(y: number) {
  // inset 0.03 from the outer profile
  for (let i = 1; i < OUTER.length; i++) {
    const [r0, y0] = OUTER[i - 1]
    const [r1, y1] = OUTER[i]
    if (y >= y0 && y <= y1) return r0 + ((y - y0) / (y1 - y0)) * (r1 - r0) - 0.03
  }
  return 0.66
}

function useGlassGeometry() {
  return useMemo(() => {
    const pts: THREE.Vector2[] = OUTER.map(([r, y]) => new THREE.Vector2(r, y))
    // lip, then inner wall back down to a thick base
    pts.push(new THREE.Vector2(0.665, 1.3))
    for (let i = OUTER.length - 2; i >= 3; i--) {
      const [, y] = OUTER[i]
      if (y < BOTTOM) break
      pts.push(new THREE.Vector2(innerRadiusAt(y), y))
    }
    pts.push(new THREE.Vector2(innerRadiusAt(-1.0), BOTTOM + 0.04))
    pts.push(new THREE.Vector2(0.42, BOTTOM))
    pts.push(new THREE.Vector2(0.0, BOTTOM))
    const g = new THREE.LatheGeometry(pts, 96)
    g.computeVertexNormals()
    return g
  }, [])
}

function useLiquidGeometry() {
  return useMemo(() => {
    const pts: THREE.Vector2[] = [new THREE.Vector2(0, BOTTOM + 0.005)]
    for (let y = BOTTOM + 0.005; y <= RIM; y += 0.04) pts.push(new THREE.Vector2(innerRadiusAt(y) * 0.985, y))
    pts.push(new THREE.Vector2(innerRadiusAt(RIM) * 0.985, RIM))
    // no top cap: the open top is drawn by back faces as a flat surface
    return new THREE.LatheGeometry(pts, 96)
  }, [])
}

const liquidVert = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vLocal;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vLocal = position;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - w.xyz);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`

const liquidFrag = /* glsl */ `
  uniform float uLevel;
  uniform float uBottom;
  uniform float uHead;
  uniform float uSettle;
  uniform float uTime;
  uniform vec3 uStout;
  uniform vec3 uRuby;
  uniform vec3 uSurge;
  uniform vec3 uCream;
  varying vec3 vWorld;
  varying vec3 vLocal;
  varying vec3 vNormal;
  varying vec3 vView;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    if (vWorld.y > uLevel) discard;
    float depth = uLevel - vWorld.y;
    float span = max(uLevel - uBottom, 0.001);
    float h = clamp((vWorld.y - uBottom) / span, 0.0, 1.0);
    float ang = atan(vLocal.z, vLocal.x);

    // cascading surge: bubbles drift down the walls
    float n = noise(vec2(ang * 7.0, vLocal.y * 12.0 + uTime * 1.4)) * 0.6
            + noise(vec2(ang * 22.0, vLocal.y * 38.0 + uTime * 2.6)) * 0.4;
    float front = uSettle * 1.3 - 0.15;          // bottom clears first
    float clearAmt = smoothstep(h - 0.18, h + 0.04, front);
    vec3 surge = mix(uSurge * 0.78, uSurge * 1.12, n);
    vec3 body = mix(surge, uStout, clearAmt);

    vec3 N = normalize(vNormal);
    float fres = pow(1.0 - abs(dot(N, normalize(vView))), 2.2);
    body += uRuby * fres * 0.75 * clearAmt;      // ruby edge against the light

    float headMask = (1.0 - smoothstep(uHead * 0.55, uHead, depth)) * step(0.002, uHead);
    vec3 cream = uCream * (0.93 + 0.07 * n);
    vec3 col = mix(body, cream, headMask);

    if (!gl_FrontFacing) {
      col = uHead > 0.01 ? uCream * (0.95 + 0.05 * n) : mix(uSurge, uStout * 1.6, clearAmt);
    } else {
      float light = 0.62 + 0.45 * max(dot(N, normalize(vec3(-0.4, 0.7, 0.6))), 0.0);
      col *= light;
    }
    gl_FragColor = vec4(col, 1.0);
  }
`

/** Stout font: a brass tower behind the glass with a spout reaching forward over it. */
function Tap() {
  return (
    <group>
      <mesh position={[0, 0.6, -0.95]} material={brass}>
        <cylinderGeometry args={[0.15, 0.2, 3.85, 48]} />
      </mesh>
      <mesh position={[0, -1.22, -0.95]} material={brassDark}>
        <cylinderGeometry args={[0.32, 0.36, 0.08, 48]} />
      </mesh>
      <mesh position={[0, 2.55, -0.95]} material={brassDark}>
        <sphereGeometry args={[0.2, 32, 16]} />
      </mesh>
      {/* spout */}
      <mesh position={[0, 2.55, -0.36]} rotation={[Math.PI / 2, 0, 0]} material={brass}>
        <cylinderGeometry args={[0.075, 0.09, 1.2, 32]} />
      </mesh>
      <mesh position={[0, 2.55, 0.24]} material={brass}>
        <sphereGeometry args={[0.08, 24, 12]} />
      </mesh>
      <mesh position={[0, 2.33, 0.24]} material={brass}>
        <cylinderGeometry args={[0.06, 0.075, 0.42, 32]} />
      </mesh>
      <mesh position={[0, 2.1, 0.24]} material={brassDark}>
        <cylinderGeometry args={[0.045, 0.06, 0.06, 24]} />
      </mesh>
      {/* handle on top of the tower */}
      <mesh position={[0, 3.12, -0.98]} rotation={[-0.22, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 1.0, 32]} />
        <meshStandardMaterial color="#120e0b" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, 2.66, -0.95]} rotation={[Math.PI / 2, 0, 0]} material={brass}>
        <torusGeometry args={[0.1, 0.025, 16, 40]} />
      </mesh>
    </group>
  )
}

function BarTop() {
  return (
    <group position={[0, -1.32, 0]}>
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[9, 0.24, 3]} />
        <meshStandardMaterial color="#3a2414" roughness={0.55} metalness={0.05} />
      </mesh>
      {/* brass drip tray */}
      <mesh position={[0, 0.02, 0.1]} material={brass}>
        <boxGeometry args={[2.2, 0.04, 1.2]} />
      </mesh>
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={i} position={[-1 + i * 0.2, 0.05, 0.1]} material={brassDark}>
          <boxGeometry args={[0.05, 0.02, 1.1]} />
        </mesh>
      ))}
    </group>
  )
}

function Shamrock({ opacity }: { opacity: RefObject<number> }) {
  const geo = useMemo(() => {
    const data = new SVGLoader().parse(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="${SHAMROCK_LEAF_PATH}"/>
        <path d="${SHAMROCK_LEAF_PATH}" transform="rotate(115 32 31)"/>
        <path d="${SHAMROCK_LEAF_PATH}" transform="rotate(-115 32 31)"/>
      </svg>`,
    )
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p))
    const g = new THREE.ShapeGeometry(shapes, 12)
    g.center()
    g.scale(0.0085, -0.0085, 0.0085)
    return g
  }, [])
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(() => {
    if (mat.current) mat.current.opacity = opacity.current ?? 0
  })
  return (
    <mesh geometry={geo} position={[0, FULL + 0.012, 0.02]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
      <meshBasicMaterial ref={mat} color="#9a7448" side={THREE.DoubleSide} transparent opacity={0} depthWrite={false} polygonOffset polygonOffsetFactor={-4} />
    </mesh>
  )
}

function Pint({ progress }: { progress: RefObject<number> }) {
  const glassGeo = useGlassGeometry()
  const liquidGeo = useLiquidGeometry()
  const group = useRef<THREE.Group>(null)
  const stream = useRef<THREE.Mesh>(null)
  const shamrockOpacity = useRef(0)
  const smooth = useRef(0)
  const { camera, size } = useThree()
  const portrait = size.width / size.height < 0.9

  const liquidMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: liquidVert,
        fragmentShader: liquidFrag,
        side: THREE.DoubleSide,
        uniforms: {
          uLevel: { value: -5 },
          uBottom: { value: -1.2 },
          uHead: { value: 0 },
          uSettle: { value: 0 },
          uTime: { value: 0 },
          uStout: { value: new THREE.Color('#140a06') },
          uRuby: { value: new THREE.Color('#6e1a12') },
          uSurge: { value: new THREE.Color('#8b6a49') },
          uCream: { value: new THREE.Color('#f3e8cf') },
        },
      }),
    [],
  )
  const uniforms = liquidMat.uniforms

  if (import.meta.env.DEV) (window as unknown as { __pint: unknown }).__pint = { uniforms, group }

  useFrame((state, dt) => {
    // ease toward scroll progress so the pour has a beat of patience
    smooth.current += ((progress.current ?? 0) - smooth.current) * Math.min(1, dt * 6)
    if (import.meta.env.DEV) {
      const forced = new URLSearchParams(location.search).get('p')
      if (forced) smooth.current = Number(forced)
    }
    const p = smooth.current

    const angle = (Math.PI / 4) * (1 - easeInOut(range(p, 0.0, 0.36)))
    const g = group.current
    if (g) {
      g.rotation.z = angle
      g.position.x = Math.sin(angle) * 0.9
    }

    const fill1 = easeOut(range(p, 0.05, 0.4))
    const fill2 = easeInOut(range(p, 0.62, 0.8))
    const levelLocal = p < 0.05 ? BOTTOM - 0.2 : BOTTOM + (FIRST_POUR - BOTTOM) * fill1 + (FULL - FIRST_POUR) * fill2

    // world-space level: lowest inner point + filled height (approximation good to a few mm)
    const lowest = -0.48 * Math.sin(angle) + BOTTOM * Math.cos(angle) + (g?.position.y ?? 0)
    const level = lowest + (levelLocal - BOTTOM) * Math.cos(angle * 0.85)
    uniforms.uLevel.value = level
    uniforms.uBottom.value = lowest
    const settle = range(p, 0.4, 0.62)
    uniforms.uSettle.value = Math.max(settle, range(p, 0.62, 0.8))
    uniforms.uHead.value = 0.13 * easeOut(settle) + 0.08 * fill2
    uniforms.uTime.value = state.clock.elapsedTime * (1 - settle * 0.7)

    shamrockOpacity.current = 0.85 * easeOut(range(p, 0.82, 0.95))

    // the stream
    const pouring = (p > 0.05 && p < 0.4) || (p > 0.62 && p < 0.8)
    const s = stream.current
    if (s) {
      s.visible = pouring
      const top = 2.08
      const len = Math.max(0.01, top - level)
      s.scale.y = len
      s.position.set(0, top - len / 2, 0.24)
      ;(s.material as THREE.MeshStandardMaterial).opacity = p > 0.62 ? 0.9 : 1
    }

    // camera: wider on portrait; leans over the head at the end
    const end = easeInOut(range(p, 0.8, 1))
    const baseZ = portrait ? 12 : 9.5
    camera.position.set(0, THREE.MathUtils.lerp(0.9, 4.6, end), THREE.MathUtils.lerp(baseZ, baseZ * 0.78, end))
    camera.lookAt(0, THREE.MathUtils.lerp(0.9, 0.55, end), 0)
  })

  return (
    <>
      <Tap />
      <BarTop />
      <group ref={group}>
        <mesh geometry={liquidGeo} material={liquidMat} renderOrder={1} />
        <Shamrock opacity={shamrockOpacity} />
        <mesh geometry={glassGeo} renderOrder={2}>
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.04}
            metalness={0}
            envMapIntensity={2.2}
            clearcoat={1}
            clearcoatRoughness={0.04}
            specularIntensity={1}
            transparent
            opacity={0.1}
            depthWrite={false}
          />
        </mesh>
      </group>
      <mesh ref={stream} visible={false}>
        <cylinderGeometry args={[0.028, 0.034, 1, 16, 1, true]} />
        <meshStandardMaterial color="#2a160c" roughness={0.25} transparent />
      </mesh>
    </>
  )
}

export default function PintScene({ progress, active, onReady }: { progress: RefObject<number>; active: boolean; onReady?: () => void }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 30, position: [0, 0.9, 9.5], near: 0.1, far: 60 }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} color="#ffe2b8" />
      <spotLight position={[-3, 6, 4]} angle={0.5} penumbra={0.8} intensity={60} color="#ffd29a" />
      <pointLight position={[3, 1, 3]} intensity={12} color="#ffb070" />
      <pointLight position={[0, -0.5, -3]} intensity={18} color="#ff9a5a" />
      <PubEnvironment />
      <Pint progress={progress} />
    </Canvas>
  )
}

