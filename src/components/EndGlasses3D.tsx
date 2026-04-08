import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type EndGlasses3DProps = {
  imageUrl: string;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const EndGlassesMesh: React.FC<{
  imageUrl: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}> = ({ imageUrl, triggerRef, containerRef }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [aspect, setAspect] = useState(1);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture);
        setAspect(loadedTexture.image.width / loadedTexture.image.height);
      },
      undefined,
      (err) => {
        console.warn('EndGlasses3D: textura', err);
      }
    );
  }, [imageUrl]);

  useEffect(() => {
    const trigger = triggerRef.current;
    const container = containerRef.current;
    const mesh = meshRef.current;
    if (!texture || !trigger || !container || !mesh) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top 92%',
        end: '+=320',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(container, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0)
      .fromTo(
        mesh.position,
        { x: 16.5, y: -3.2, z: 2.8 },
        { x: -13.4, y: -0.35, z: 2.8, ease: 'power2.out' },
        0
      )
      .fromTo(
        mesh.rotation,
        { x: 0.08, y: -0.42, z: 0.04 },
        { x: 0.1, y: -0.04, z: 0, ease: 'power2.out' },
        0
      );

    return () => {
      tl.kill();
    };
  }, [texture, triggerRef, containerRef]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[14.5, -2.9, 2.8]}>
      <planeGeometry args={[3.4 * aspect, 3.4]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={1}
        color={new THREE.Color(2.5, 2.5, 2.5)}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

export const EndGlasses3D: React.FC<EndGlasses3DProps> = ({ imageUrl, triggerRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="end-glasses-canvas" aria-hidden>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <fog attach="fog" args={['#030303', 5, 25]} />
        <EndGlassesMesh imageUrl={imageUrl} triggerRef={triggerRef} containerRef={containerRef} />
      </Canvas>
    </div>
  );
};
