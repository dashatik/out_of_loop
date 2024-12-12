"use client";

import React from "react";
import { usePathname } from "next/navigation";
import LandingPage from "@/components/landing-page";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" ? (
        <LandingPage />
      ) : (
        children
      )}
    </>
  );
}
