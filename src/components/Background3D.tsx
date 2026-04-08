import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
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
        console.warn('Aguardando upload da imagem oakley.png', err);
      }
    );
  }, [imageUrl]);

  useEffect(() => {
    if (!meshRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    tl.to(meshRef.current.position, { y: -2, z: 2, ease: 'power1.inOut' }, 0)
      .to(meshRef.current.rotation, { x: 0.2, y: -0.3, z: 0.1, ease: 'none' }, 0)
      .to(meshRef.current.position, { x: -3, ease: 'none' }, 0.5)
      .to(meshRef.current.rotation, { y: 0.5, ease: 'none' }, 0.5)
      .to(meshRef.current.position, { x: 0, y: -1.5, z: 4, ease: 'power2.inOut' }, 1)
      .to(meshRef.current.rotation, { y: 0, x: 0.1, z: 0, ease: 'power2.inOut' }, 1);
  }, [texture]);

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[2, 2, -2]}>
      <planeGeometry args={[10 * aspect, 10]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        opacity={1}
        color={new THREE.Color(2.5, 2.5, 2.5)}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

export const Background3D: React.FC = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <fog attach="fog" args={['#030303', 5, 25]} />
        <SolidGlassesImage imageUrl="/281088-3-530x665-removebg-preview.png" />
      </Canvas>
    </div>
  );
};
