"use client"

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, Text } from "@react-three/drei"
import * as THREE from "three"

function GiftBox() {
  const boxRef = useRef<THREE.Mesh>(null)
  const lidRef = useRef<THREE.Mesh>(null)
  const [isOpened, setIsOpened] = useState(false)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Rotate the box to give it a subtle animation
    if (boxRef.current) {
      boxRef.current.rotation.y = Math.sin(t * 0.5) * 0.2
    }

    // Animate the lid opening
    if (lidRef.current) {
      // Lid moves upwards with a sinusoidal motion
      lidRef.current.position.x = 0.3 + Math.sin(t * 3) * 0.3

      // Open the box when lid is high enough
      if (lidRef.current.position.y > 1.0 && !isOpened) {
        setIsOpened(true) // Trigger box open
      }
    }
  })

  return (
    <group position={[0, -0.5, 0]}>
      {/* Box */}
      <mesh ref={boxRef} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#ffc0cb" />
      </mesh>

      {/* Lid */}
      <mesh ref={lidRef} position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.2, 1.25]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>
    </group>
  )
}


function Balloons({ count = 10, isOpened }: { count: number, isOpened: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const dummy = useRef(new THREE.Object3D())

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.current.position.set(
        (Math.random() - 0.5) * 0.5, // Horizontal spread
        Math.random() * 0.5 + 0.5,   // Vertical starting point (inside the box)
        (Math.random() - 0.5) * 0.5  // Depth spread
      )
      dummy.current.scale.set(0.3, 0.3, 0.3) // Membesarkan ukuran balon
      dummy.current.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.current.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      mesh.current.getMatrixAt(i, dummy.current.matrix)
      dummy.current.position.setFromMatrixPosition(dummy.current.matrix)

      // Animasi balon naik
      if (isOpened) {
        dummy.current.position.y += 0.02 + Math.sin(t + i) * 0.005 // Balon lebih cepat naik saat kotak terbuka
      } else {
        dummy.current.position.y += 0.01 + Math.sin(t + i) * 0.002 // Balon lebih lambat sebelum kotak terbuka
      }
      
      if (dummy.current.position.y > 3) dummy.current.position.y = 0.5 // Reset setelah naik tinggi

      dummy.current.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.current.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.2, 16, 16]} /> {/* Membesarkan diameter bola */}
      <meshStandardMaterial color="#ff6347" />
    </instancedMesh>
  )
}

function Confetti({ count = 50 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const dummy = useRef(new THREE.Object3D())

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.current.position.set(
        (Math.random() - 0.5) * 5,
        Math.random() * 3,
        (Math.random() - 0.5) * 5
      )
      dummy.current.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.current.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      mesh.current.getMatrixAt(i, dummy.current.matrix)
      dummy.current.position.setFromMatrixPosition(dummy.current.matrix)
      dummy.current.position.y -= 0.01 + Math.sin(t + i) * 0.002
      if (dummy.current.position.y < -1.5) dummy.current.position.y = 3
      dummy.current.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.current.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshStandardMaterial color="#ff69b4" />
    </instancedMesh>
  )
}

export default function BirthdaySurprise3D() {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={["#fff0f5"]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} castShadow intensity={1.5} />

      <GiftBox />
      <Balloons count={20} isOpened={isOpened} /> {/* Balon bergerak keluar saat kotak terbuka */}
      <Confetti />

      <Text
        position={[0, 1.8, 0]}
        fontSize={0.3}
        color="#ff1493"
        anchorX="center"
        anchorY="middle"
      >
        Selamat Ulang Tahun Sayang! 💖
      </Text>

      <Environment preset="sunset" />
      <ContactShadows position={[0, -1.5, 0]} opacity={0.25} scale={10} blur={2} far={5} />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  )
}
