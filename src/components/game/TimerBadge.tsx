"use client";

import React from "react";

interface TimerBadgeProps {
  elapsedSeconds: number;
  stopped?: boolean;
}

export function TimerBadge({ elapsedSeconds, stopped }: TimerBadgeProps) {
  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="timerRow">
      <span className={`timerChipBig ${stopped ? "disabled" : ""}`} title="Time elapsed">
        <span className="crumbIconWrap">⏱️</span>
        <span className="crumbLabel">{formatTime(elapsedSeconds)}</span>
      </span>
    </div>
  );
}

