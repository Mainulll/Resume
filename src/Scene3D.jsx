import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'

function CursorInteractiveShape({ children, mouse, offset = [0, 0], color = '#ffffff', ...props }) {
  const ref = useRef()
  const target = useRef({ x: 0, y: 0 })

  useFrame(() => {
    if (!ref.current) return
    target.current.x += (mouse.current[0] * 0.14 - target.current.x) * 0.055
    target.current.y += (mouse.current[1] * 0.14 - target.current.y) * 0.055
    ref.current.rotation.y = target.current.x + offset[0]
    ref.current.rotation.x = -target.current.y + offset[1]
  })

  return (
    <mesh ref={ref} {...props}>
      {children}
      <MeshTransmissionMaterial
        backside
        backsideThickness={0.3}
        samples={10}
        thickness={0.18}
        chromaticAberration={0.028}
        anisotropy={0.12}
        distortion={0.04}
        distortionScale={0.25}
        temporalDistortion={0.04}
        iridescence={0.35}
        iridescenceIOR={1.4}
        iridescenceThicknessRange={[0, 1200]}
        clearcoat={1}
        clearcoatIOR={1.35}
        clearcoatRoughness={0.04}
        color={color}
        transmission={0.97}
        roughness={0.04}
        metalness={0}
        attenuationDistance={0.5}
        attenuationColor="#d0d0ff"
      />
    </mesh>
  )
}

function Scene({ mouse }) {
  return (
    <>
      {/* Ambient — keep low so glass catches directional light dramatically */}
      <ambientLight intensity={0.3} color="#8080c0" />

      {/* Key light — bright white from top-right, main specular source */}
      <directionalLight position={[7, 8, 5]} intensity={3.2} color="#ffffff" />

      {/* Fill light — cool indigo from left, gives the glass its blue-violet tint */}
      <directionalLight position={[-6, 3, 4]} intensity={1.8} color="#a5a8ff" />

      {/* Rim light — warm purple from below-front, separates shapes from bg */}
      <directionalLight position={[0, -5, 5]} intensity={1.2} color="#c4b5fd" />

      {/* Point lights for interior glow & iridescence excitation */}
      <pointLight position={[2, 3, 3]} intensity={1.4} color="#818cf8" distance={12} decay={2} />
      <pointLight position={[-3, -1, 2]} intensity={0.8} color="#7c3aed" distance={10} decay={2} />

      {/* Hexagonal prism — security, structure */}
      <Float speed={0.9} rotationIntensity={0.06} floatIntensity={0.3}>
        <group position={[-2.8, 0.7, -5]} scale={0.52} rotation={[0.1, 0, Math.PI / 6]}>
          <CursorInteractiveShape mouse={mouse} offset={[0.15, 0.05]} color="#e8e8ff">
            <cylinderGeometry args={[0.8, 0.8, 1.6, 6]} />
          </CursorInteractiveShape>
        </group>
      </Float>

      {/* Sphere — holistic knowledge */}
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.36}>
        <group position={[-1.0, -0.9, -4.5]} scale={0.44}>
          <CursorInteractiveShape mouse={mouse} offset={[0.2, -0.1]} color="#f0f0ff">
            <sphereGeometry args={[1.1, 48, 48]} />
          </CursorInteractiveShape>
        </group>
      </Float>

      {/* Torus — continuous growth */}
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={[2.4, 0.2, -5]} scale={0.56} rotation={[0.2, 0, Math.PI / 4]}>
          <CursorInteractiveShape mouse={mouse} offset={[-0.12, 0.15]} color="#ede8ff">
            <torusGeometry args={[0.9, 0.3, 32, 64]} />
          </CursorInteractiveShape>
        </group>
      </Float>

      {/* Icosahedron — multifaceted perspective */}
      <Float speed={1.1} rotationIntensity={0.07} floatIntensity={0.26}>
        <group position={[1.5, 1.5, -5.5]} scale={0.38}>
          <CursorInteractiveShape mouse={mouse} offset={[0.1, -0.08]} color="#f0eeff">
            <icosahedronGeometry args={[1, 0]} />
          </CursorInteractiveShape>
        </group>
      </Float>

      {/* Dodecahedron — structured wisdom */}
      <Float speed={1.3} rotationIntensity={0.09} floatIntensity={0.22}>
        <group position={[3.1, -0.8, -6]} scale={0.33}>
          <CursorInteractiveShape mouse={mouse} offset={[-0.15, 0.1]} color="#e8e0ff">
            <dodecahedronGeometry args={[1, 0]} />
          </CursorInteractiveShape>
        </group>
      </Float>
    </>
  )
}

export default function Scene3D() {
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
    <div className="scene-3d" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  )
}
