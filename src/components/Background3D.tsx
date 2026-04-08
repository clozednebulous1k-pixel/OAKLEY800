import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SolidGlassesImage: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [aspect, setAspect] = useState(1);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture);
        const imageAspect = loadedTexture.image.width / loadedTexture.image.height;
        setAspect(imageAspect);
      },
      undefined,
      (err) => {
        console.warn("Aguardando upload da imagem oakley.png", err);
      }
    );
  }, [imageUrl]);

  useEffect(() => {
    if (!meshRef.current) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    });

    // O óculos inteiro roda e voa com o scroll perfeitamente fixo
    tl.to(meshRef.current.position, { y: -2, z: 2, ease: "power1.inOut" }, 0)
      .to(meshRef.current.rotation, { x: 0.2, y: -0.3, z: 0.1, ease: "none" }, 0)
      .to(meshRef.current.position, { x: -3, ease: "none" }, 0.5)
      .to(meshRef.current.rotation, { y: 0.5, ease: "none" }, 0.5)
      .to(meshRef.current.position, { x: 0, y: -1.5, z: 4, ease: "power2.inOut" }, 1)
      .to(meshRef.current.rotation, { y: 0, x: 0.1, z: 0, ease: "power2.inOut" }, 1);
  }, [texture]);

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[2, 2, -2]}>
      {/* Escala o plano baseado na proporção real da foto */}
      <planeGeometry args={[10 * aspect, 10]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        opacity={1} // Sólido total
        color={new THREE.Color(2.5, 2.5, 2.5)} // Brilho estourado/luminoso (Over-exposure)
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

const AbstractWaves: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const particleCount = 6000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 10;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      col[i * 3] = 0.8 + Math.random() * 0.2; 
      col[i * 3 + 1] = 0.05;                  
      col[i * 3 + 2] = 0.05;                  
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime * 0.5;
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < particleCount; i++) {
      const x = positions[i * 3];
      const zOriginal = positions[i * 3 + 2];
      const wave = Math.sin(x * 0.5 + time) * 2 + Math.cos(zOriginal * 0.3 + time) * 2;
      positionsAttr.setY(i, wave - 5); 
    }
    positionsAttr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.05;
  });

  useEffect(() => {
    if (!materialRef.current) return;
    gsap.to(materialRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=600",
        scrub: true,
      }
    });
  }, []);

  return (
    <points ref={pointsRef} position={[0, 0, -10]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const Background3D: React.FC = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <fog attach="fog" args={['#030303', 5, 25]} />
        <AbstractWaves />
        <SolidGlassesImage imageUrl="/281088-3-530x665-removebg-preview.png" />
      </Canvas>
    </div>
  );
};
