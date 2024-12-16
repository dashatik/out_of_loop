"use client";

import React from "react";
import { usePathname } from "next/navigation";
import IntroPage from "./intro-page";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" ? (
        <IntroPage /> // Ensure only "/" renders IntroPage
      ) : (
        children
      )}
    </>
  );
}