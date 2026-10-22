"use client";

import dynamic from "next/dynamic";

// A MapLibre (WebGL) és a window-függő komponensek miatt a kliens csak böngészőben renderel.
const Root = dynamic(() => import("./Root"), { ssr: false });

export default function ClientOnly() {
  return <Root />;
}
