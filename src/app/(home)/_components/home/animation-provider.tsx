"use client";

import type React from "react";

import { LazyMotion, domAnimation } from "framer-motion";

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
