"use client";

import React, { useRef, useEffect } from "react";
import { Tile } from "./Tile";
import { Keyboard } from "./Keyboard";
import { TileState } from "@/lib/scoring";

interface GameBoardProps {
  rows: number;
  cols: number;
  board: string[][];
  gridStates: TileState[][];
  keyStates: Record<string, TileState>;
  flippingRow: number | null;
  correct3DTiles: Record<string, boolean>;
  onKey: (key: string) => void;
}

export function GameBoard({
  rows,
  cols,
  board,
  gridStates,
  keyStates,
  flippingRow,
  correct3DTiles,
  onKey,
}: GameBoardProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const attachTilt = (container: HTMLElement | null, selector: string) => {
      if (!container) return;
      let activeTile: HTMLElement | null = null;

      const handleMove = (e: PointerEvent) => {
        const target = e.target as HTMLElement;
        const tile = target.closest(selector) as HTMLElement;
        if (!tile || !container.contains(tile)) return;

        const rect = tile.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        tile.style.setProperty("--ry", `${(px * 12).toFixed(2)}deg`);
        tile.style.setProperty("--rx", `${(-py * 12).toFixed(2)}deg`);
        activeTile = tile;
      };

      const handleLeave = () => {
        if (activeTile) {
          activeTile.style.setProperty("--rx", "0deg");
          activeTile.style.setProperty("--ry", "0deg");
          activeTile = null;
        }
      };

      container.addEventListener("pointermove", handleMove);
      container.addEventListener("pointerleave", handleLeave, true);

      return () => {
        container.removeEventListener("pointermove", handleMove);
        container.removeEventListener("pointerleave", handleLeave, true);
      };
    };

    const cleanupGrid = attachTilt(gridRef.current, ".tile");
    const cleanupKb = attachTilt(keyboardRef.current, ".key");

    return () => {
      if (cleanupGrid) cleanupGrid();
      if (cleanupKb) cleanupKb();
    };
  }, []);

  return (
    <div className="centerPlay">
      <div className="boardWrap">
        <div ref={gridRef} className="grid">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="row" id={`row-${r}`}>
              {Array.from({ length: cols }).map((_, c) => {
                const letter = board[r]?.[c] || "";
                const state = gridStates[r]?.[c] || "empty";
                const isFlipping = flippingRow === r;
                const isCorrect3D = !!correct3DTiles[`${r}-${c}`];

                return (
                  <Tile
                    key={c}
                    letter={letter}
                    state={state}
                    isFlipping={isFlipping}
                    isCorrect3D={isCorrect3D}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div ref={keyboardRef} className="w-full flex justify-center">
        <Keyboard keyStates={keyStates} onKey={onKey} />
      </div>
    </div>
  );
}

