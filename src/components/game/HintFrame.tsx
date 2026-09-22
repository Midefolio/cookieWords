"use client";

import React from "react";

interface HintFrameProps {
  emoji: string;
  label: string;
  revealed?: boolean;
}

export function HintFrame({ emoji, label, revealed }: HintFrameProps) {
  return (
    <div className="hintPanel">
      <div className="hintFrame">
        <div className={`inner ${revealed ? "revealed" : ""}`}>{emoji}</div>
      </div>
      <div className="hintLabel">{label}</div>
    </div>
  );
}

