import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* ── Gem Geometry ───────────────────────────────────────────────────────
   Custom diamond/gem shape — a cut gemstone with crown (top) and
   pavilion (bottom). Matches the visual identity of the SVG LogoMark.
─────────────────────────────────────────────────────────────────────── */
function createGemGeometry() {
  const vertices = []
  const indices = []
  const sides = 8
  const crownHeight = 0.45
  const pavilionDepth = 0.9
  const tableRadius = 0.38
  const girdleRadius = 0.7
  const topPoint = crownHeight
  const girdleY = 0
  const bottomPoint = -pavilionDepth

  // Top point
  vertices.push(0, topPoint, 0) // 0

  // Table ring (top inner ring)
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2
    vertices.push(
      Math.cos(angle) * tableRadius,
      topPoint * 0.65,
      Math.sin(angle) * tableRadius
    )
  } // 1..sides

  // Girdle ring (widest point)
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + Math.PI / sides
    vertices.push(
      Math.cos(angle) * girdleRadius,
      girdleY,
      Math.sin(angle) * girdleRadius
    )
  } // (sides+1)..(2*sides)

  // Bottom point (culet)
  vertices.push(0, bottomPoint, 0) // 2*sides + 1

  const topIdx = 0
  const tableStart = 1
  const girdleStart = sides + 1
  const bottomIdx = 2 * sides + 1

  // Crown faces: top → table ring
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides
    indices.push(topIdx, tableStart + i, tableStart + next)
  }

  // Crown sides: table ring → girdle ring
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides
    indices.push(tableStart + i, girdleStart + i, tableStart + next)
    indices.push(tableStart + next, girdleStart + i, girdleStart + ((i + 1) % sides))
  }

  // Pavilion faces: girdle ring → bottom
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides
    indices.push(girdleStart + i, bottomIdx, girdleStart + next)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  )
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/* ── Interactive Gem ────────────────────────────────────────────────────
   Slowly rotates on Y axis. If mouse ref provided, also reacts to
   cursor position with smooth lerped rotation offsets.
─────────────────────────────────────────────────────────────────────── */
function GemMesh({ mouse, autoOnly = false, scale = 1 }) {
  const ref = useRef()
  const target = useRef({ x: 0, y: 0 })
  const geometry = useMemo(() => createGemGeometry(), [])

  useFrame((_, delta) => {
    if (!ref.current) return
    // Slow continuous Y rotation
    ref.current.rotation.y += delta * 0.4

    if (!autoOnly && mouse?.current) {
      // Mouse-reactive rotation
      target.current.x += (mouse.current[0] * 0.3 - target.current.x) * 0.05
      target.current.y += (mouse.current[1] * 0.3 - target.current.y) * 0.05
      ref.current.rotation.x = -target.current.y + 0.15
      ref.current.rotation.z = target.current.x * 0.15
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={autoOnly ? 0.04 : 0.06} floatIntensity={autoOnly ? 0.1 : 0.25}>
      <mesh ref={ref} geometry={geometry} scale={scale}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.35}
          samples={autoOnly ? 6 : 12}
          thickness={0.22}
          chromaticAberration={0.03}
          anisotropy={0.1}
          distortion={0.05}
          distortionScale={0.2}
          temporalDistortion={0.03}
          iridescence={autoOnly ? 0 : 0.4}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          clearcoatRoughness={0.04}
          color="#c8d8ff"
          transmission={0.96}
          roughness={0.05}
          metalness={0}
          attenuationDistance={0.6}
          attenuationColor="#88ccff"
        />
      </mesh>
    </Float>
  )
}

/* ── Loading Gem (large, interactive) ──────────────────────────────── */
export function LoadingGem() {
  const mouse = useRef([0, 0])

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / globalThis.innerWidth) * 2 - 1
      const y = -(e.clientY / globalThis.innerHeight) * 2 + 1
      mouse.current = [x, y]
    }
    globalThis.addEventListener('pointermove', handleMove)
    return () => globalThis.removeEventListener('pointermove', handleMove)
  }, [])

  return (
    <div className="loading-gem-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} color="#88aacc" />
        <directionalLight position={[5, 8, 5]} intensity={3.5} color="#ffffff" />
        <directionalLight position={[-4, 3, 4]} intensity={1.5} color="#38bdf8" />
        <directionalLight position={[0, -4, 5]} intensity={1.0} color="#a78bfa" />
        <pointLight position={[2, 2, 3]} intensity={1.2} color="#38bdf8" distance={10} decay={2} />
        <pointLight position={[-2, -1, 2]} intensity={0.7} color="#8b5cf6" distance={8} decay={2} />
        <GemMesh mouse={mouse} scale={1} />
      </Canvas>
    </div>
  )
}

/* ── Navbar Gem (mini, auto-rotate only) ───────────────────────────── */
export function NavGem() {
  return (
    <div className="nav-gem-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        dpr={[1, 1]}
      >
        <ambientLight intensity={0.5} color="#88aacc" />
        <directionalLight position={[5, 6, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-3, 2, 3]} intensity={1.0} color="#38bdf8" />
        <GemMesh autoOnly scale={0.9} />
      </Canvas>
    </div>
  )
}
