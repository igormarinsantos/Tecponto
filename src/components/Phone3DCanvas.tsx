import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
import { Model } from "./IphoneModel";

export default function Phone3DCanvas() {
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        <pointLight position={[0, -2, 2]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Center>
            <Model 
              scale={18} // scaled to fit viewport nicely
              position={[0, 0, 0]} 
              rotation={[0.35, -0.4, 0]} // elegant initial angle
            />
          </Center>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}


