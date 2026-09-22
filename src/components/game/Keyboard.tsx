"use client";

import React from "react";
import { TileState } from "@/lib/scoring";

interface KeyboardProps {
  keyStates: Record<string, TileState>;
  onKey: (key: string) => void;
}

const KEY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "*"],
];

export function Keyboard({ keyStates, onKey }: KeyboardProps) {
  const handleClick = (keyStr: string) => {
    if (keyStr === "ENTER") onKey("Enter");
    else if (keyStr === "*") onKey("Backspace");
    else onKey(keyStr);
  };

  return (
    <div className="keyboard">
      {KEY_ROWS.map((row, rIdx) => (
        <div key={rIdx} className="keyRow">
          {row.map((k) => {
            const isWide = k === "ENTER" || k === "*";
            const state = keyStates[k];
            const label = k === "ENTER" ? "ENTER" : k === "*" ? "⌫" : k;

            return (
              <button
                key={k}
                type="button"
                className={`key ${isWide ? "wide" : ""}`}
                data-state={state || undefined}
                data-key={k}
                onClick={() => handleClick(k)}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

