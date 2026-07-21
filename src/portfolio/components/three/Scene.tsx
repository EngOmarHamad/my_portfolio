import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'
import { useReducedMotion } from '@/portfolio/hooks/useReducedMotion'

function FloatingShape() {
  const meshRef = useRef<Mesh>(null)
  const reducedMotion = useReducedMotion()

  useFrame(({ pointer }) => {
    if (reducedMotion || !meshRef.current) return
    meshRef.current.rotation.x = pointer.y * 0.3 + 0.5
    meshRef.current.rotation.y = pointer.x * 0.3 + 0.3
  })

  return (
    <Float speed={reducedMotion ? 0 : 2} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#EEC047"
          emissive="#F1633D"
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.7}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

function Particles() {
  const count = 40
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return pos
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#EEC047"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#256F6C" />
      <FloatingShape />
      <Particles />
    </>
  )
}

export function Scene() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
