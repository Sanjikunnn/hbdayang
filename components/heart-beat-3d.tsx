"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, MeshDistortMaterial, Environment, ContactShadows } from "@react-three/drei"
import type { Mesh, Group } from "three"
import { useSpring, animated, config } from "@react-spring/three"
import * as THREE from "three"

// Heart model component
function Heart({ position = [0, 0, 0], ...props }) {
  const group = useRef<Group>(null!)
  const mesh = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [beatIntensity, setBeatIntensity] = useState(0.5)

  // Animation for heartbeat
  const { scale } = useSpring({
    scale: clicked ? [1.2, 1.2, 1.2] : hovered ? [1.1, 1.1, 1.1] : [1, 1, 1],
    config: config.wobbly,
  })

  // Animation for continuous beating
  useFrame((state) => {
    if (!group.current) return

    // Base heartbeat animation
    const t = state.clock.getElapsedTime()
    const beatSpeed = clicked ? 3 : hovered ? 2 : 1
    const beatStrength = clicked ? 0.15 : hovered ? 0.1 : 0.05

    // Simulate heartbeat with two pulses
    const beat = Math.sin(t * beatSpeed * 2) * beatStrength * beatIntensity
    const baseBeat = 1 + Math.max(0, beat)

    group.current.scale.x = baseBeat
    group.current.scale.y = baseBeat
    group.current.scale.z = baseBeat

    // Gentle rotation
    group.current.rotation.y = Math.sin(t * 0.5) * 0.2
    group.current.rotation.z = Math.cos(t * 0.3) * 0.1
  })

  // Create a heart shape using geometry
  return (
    <animated.group
      ref={group}
      position={position}
      scale={scale as any}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        setClicked(!clicked)
        setBeatIntensity(clicked ? 0.5 : 1)
      }}
      {...props}
    >
      <mesh ref={mesh} castShadow receiveShadow>
        {/* Heart shape using a sphere with distortion */}
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={clicked ? "#ff1a5e" : hovered ? "#ff4d79" : "#ff6b8e"}
          speed={clicked ? 5 : hovered ? 3 : 2}
          distort={clicked ? 0.6 : hovered ? 0.4 : 0.3}
          radius={1}
          factor={clicked ? 3 : hovered ? 2 : 1}
          metalness={0.5}
          roughness={0.4}
          emissive={clicked ? "#ff1a5e" : hovered ? "#ff4d79" : "#ff6b8e"}
          emissiveIntensity={clicked ? 0.5 : hovered ? 0.3 : 0.2}
        />
      </mesh>

      {/* Create the heart shape indentation */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <MeshDistortMaterial
          color={clicked ? "#ff1a5e" : hovered ? "#ff4d79" : "#ff6b8e"}
          speed={clicked ? 5 : hovered ? 3 : 2}
          distort={clicked ? 0.6 : hovered ? 0.4 : 0.3}
          factor={clicked ? 3 : hovered ? 2 : 1}
          metalness={0.5}
          roughness={0.4}
          emissive={clicked ? "#ff1a5e" : hovered ? "#ff4d79" : "#ff6b8e"}
          emissiveIntensity={clicked ? 0.5 : hovered ? 0.3 : 0.2}
        />
      </mesh>

      {/* Create the heart shape indentation */}
      <mesh position={[0, -0.8, 0]} castShadow>
        <coneGeometry args={[1, 1.5, 32]} />
        <MeshDistortMaterial
          color={clicked ? "#ff1a5e" : hovered ? "#ff4d79" : "#ff6b8e"}
          speed={clicked ? 5 : hovered ? 3 : 2}
          distort={clicked ? 0.6 : hovered ? 0.4 : 0.3}
          factor={clicked ? 3 : hovered ? 2 : 1}
          metalness={0.5}
          roughness={0.4}
          emissive={clicked ? "#ff1a5e" : hovered ? "#ff4d79" : "#ff6b8e"}
          emissiveIntensity={clicked ? 0.5 : hovered ? 0.3 : 0.2}
        />
      </mesh>
    </animated.group>
  )
}

// Simplified particles system using instanced meshes
function Particles({ count = 20 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const dummy = useRef(new THREE.Object3D())

  // Set up the instanced mesh
  useEffect(() => {
    if (!mesh.current) return

    // Position the particles
    for (let i = 0; i < count; i++) {
      dummy.current.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5)

      dummy.current.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.current.matrix)
    }

    mesh.current.instanceMatrix.needsUpdate = true
  }, [count])

  // Animate the particles
  useFrame(({ clock }) => {
    if (!mesh.current) return

    const time = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      // Get the current position
      mesh.current.getMatrixAt(i, dummy.current.matrix)
      dummy.current.position.setFromMatrixPosition(dummy.current.matrix)

      // Animate position with sine waves
      const initialX = (i % 5) - 2.5
      const initialY = Math.floor(i / 5) - 2
      const initialZ = Math.sin(i) * 2

      dummy.current.position.x = initialX + Math.sin(time * 0.5 + i) * 0.1
      dummy.current.position.y = initialY + Math.cos(time * 0.5 + i) * 0.1
      dummy.current.position.z = initialZ + Math.sin(time * 0.3 + i) * 0.1

      // Update the matrix
      dummy.current.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.current.matrix)
    }

    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#ff6b8e" transparent opacity={0.8} />
    </instancedMesh>
  )
}

// Scene setup
export default function HeartBeat3D() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={["#fee5eb"]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Heart position={[0, 0, 0]} />
      <Particles count={20} />

      <Environment preset="sunset" />
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={5} />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  )
}
