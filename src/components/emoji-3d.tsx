"use client";

import React, { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";

const EmojiPlane = ({ emoji }: { emoji: string }) => {
  const planeRef = React.useRef<any>();
  const [texture, setTexture] = useState<any>();

  // Create an emoji canvas and load it as a texture
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = 256;
      canvas.height = 256;
      ctx.font = "200px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);

      const loader = new TextureLoader();
      loader.load(canvas.toDataURL(), (loadedTexture) => {
        setTexture(loadedTexture);
      });
    }
  }, [emoji]);

  useFrame(() => {
    if (planeRef.current) {
      planeRef.current.rotation.y += 0.01; // Rotate the plane
    }
  });

  return (
    <mesh ref={planeRef}>
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

const Emoji3D = () => {
  const [emoji, setEmoji] = useState("😀");
  const emojis = ["😀", "😂", "😎", "🤔", "🥳", "😍", "😡"];

  useEffect(() => {
    const interval = setInterval(() => {
      setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 2000); // Change emoji every 2 seconds
    return () => clearInterval(interval); // Cleanup interval
  }, [emojis]);

  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <EmojiPlane emoji={emoji} />
      <OrbitControls />
    </Canvas>
  );
};

export default Emoji3D;
