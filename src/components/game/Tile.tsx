"use client";

import React, { useRef, useEffect } from "react";
import { TileState } from "@/lib/scoring";

interface TileProps {
  letter: string;
  state: TileState;
  isFlipping?: boolean;
  isCorrect3D?: boolean;
}

const CRUMB_COLORS: Record<string, string[]> = {
  tapped: ["#F4C95D", "#E9D9B4", "#C9955B"],
  correct: ["#8EE08F", "#F4C95D", "#4A9F55"],
  present: ["#F4C95D", "#F0C567", "#C99730"],
  absent: ["#9D948B", "#5C554C"],
};

export function Tile({ letter, state, isFlipping, isCorrect3D }: TileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const prevStateRef = useRef<TileState>(state);

  useEffect(() => {
    if (prevStateRef.current !== state && state !== "empty" && tileRef.current) {
      burstParticles(tileRef.current, state);
    }
    prevStateRef.current = state;
  }, [state]);

  const burstParticles = (el: HTMLDivElement, kind: TileState) => {
    const isCorrect = kind === "correct";
    const count = kind === "tapped" ? 8 : isCorrect ? 18 : 12;
    const colors = CRUMB_COLORS[kind] || CRUMB_COLORS.tapped;

    for (let i = 0; i < count; i++) {
      const isSparkle = i % 4 === 0;
      const p = document.createElement("span");
      p.className = isSparkle ? "sparkle-particle" : "crumb-particle";

      const angle = Math.random() * Math.PI * 2;
      const dist = (isCorrect ? 58 : kind === "tapped" ? 34 : 44) + Math.random() * 24;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - (isCorrect ? 18 : 10);
      const size = (isCorrect ? 7 : kind === "tapped" ? 4.5 : 5) + Math.random() * 4;

      p.style.setProperty("--tx", `${tx.toFixed(1)}px`);
      p.style.setProperty("--ty", `${ty.toFixed(1)}px`);
      p.style.setProperty("--rot", `${Math.floor(Math.random() * 360)}deg`);
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      if (!isSparkle) {
        p.style.background = `radial-gradient(circle, ${colors[i % colors.length]} 0%, #7A5330 65%, #4A2E17 100%)`;
        p.style.boxShadow = "0 0 3px rgba(0,0,0,0.5), 0 0 5px rgba(244,201,93,0.4)";
      }

      p.style.animationDelay = `${(Math.random() * 0.07).toFixed(2)}s`;
      el.appendChild(p);

      setTimeout(() => p.remove(), 950);
    }
  };

  return (
    <div
      ref={tileRef}
      className={`tile ${isFlipping ? "flip" : ""} ${isCorrect3D ? "correct3d" : ""}`}
      data-state={state}
    >
      {letter && <span className="tileLetter">{letter}</span>}
      {state === "correct" && <span className="correctBadge">🍪</span>}
      {isCorrect3D && <span className="correctShine" />}
    </div>
  );
}

