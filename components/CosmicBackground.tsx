import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Fix for missing JSX Intrinsic Elements definitions for React Three Fiber components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      ambientLight: any;
    }
  }
}

const StarField = (props: any) => {
  const ref = useRef<THREE.Points>(null!);
  
  const sphere = useMemo(() => {
    const particles = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.2 + Math.random() * 1.5; // Radius variation

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particles[i * 3] = x;
      particles[i * 3 + 1] = y;
      particles[i * 3 + 2] = z;
    }
    return particles;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#a5b4fc"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const ShootingStar = () => {
    const ref = useRef<THREE.Mesh>(null!);
    const speed = useRef(Math.random() * 2 + 1);
    const offset = useRef(Math.random() * 100);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const t = (time * speed.current + offset.current) % 10;
        
        if (t < 1) {
             ref.current.visible = true;
             // Simple linear movement across screen
             ref.current.position.set(5 - t * 10, 2 - t * 4, 0);
             ref.current.scale.set(1 - t, 1 - t, 1);
        } else {
            ref.current.visible = false;
        }
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial color="white" />
        </mesh>
    );
};


const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-cosmic-900">
        {/* Fallback gradient if WebGL fails or loads slow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0B0B15] to-[#1a1a40] opacity-80" />
        
        <Canvas camera={{ position: [0, 0, 1] }}>
            <StarField />
            <ambientLight intensity={0.5} />
            <ShootingStar />
        </Canvas>
    </div>
  );
};

export default CosmicBackground;