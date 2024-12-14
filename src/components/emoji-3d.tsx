"use client";

import React, { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";

const LogoPlane = ({ logo, scale }: { logo: string; scale: number }) => {
  const planeRef = React.useRef<any>();
  const [texture, setTexture] = useState<any>();

  // Load logo as texture
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(logo, (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, [logo]);

  useFrame(() => {
    if (planeRef.current) {
      planeRef.current.rotation.y += 0.01; // Rotate the plane
    }
  });

  return (
    <mesh ref={planeRef} scale={[scale, scale, scale]}>
      <planeGeometry args={[3, 3]} />
      {texture && (
        <meshBasicMaterial
          map={texture}
          transparent
          side={2} // Make the material double-sided
        />
      )}
    </mesh>
  );
};

const Logo3D = () => {
  const [logo, setLogo] = useState("/logos/chatgpt.png");
  const [scale, setScale] = useState(1); // Default scale
  const logos = [
    "/logos/chatgpt.png", // Path to ChatGPT logo
    "/logos/claude.png", // Path to Claude logo
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale(1.5); // Larger scale for smaller screens
      } else {
        setScale(1); // Default scale for larger screens
      }
    };

    handleResize(); // Set initial scale
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogo(logos[Math.floor(Math.random() * logos.length)]);
    }, 2000); // Change logo every 2 seconds
    return () => clearInterval(interval); // Cleanup interval
  }, [logos]);

  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <LogoPlane logo={logo} scale={scale} />
      <OrbitControls />
    </Canvas>
  );
};

export default Logo3D;
