"use client";

import React from "react";

interface HintModalProps {
  show: boolean;
  title: string;
  emoji?: string;
  letter?: string;
  text: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function HintModal({ show, title, emoji, letter, text, onClose, actionLabel, onAction }: HintModalProps) {
  if (!show) return null;

  return (
    <div className="marketModal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="marketPanel">
        <button className="marketCloseBtn" type="button" onClick={onClose}>
          ✕
        </button>
        <div className="marketTitle">{title}</div>
        <div className="hintModalBody">
          {emoji && <span className="hintModalEmoji">{emoji}</span>}
          {letter && <span className="hintModalLetter">{letter}</span>}
          <div>{text}</div>
          {actionLabel && onAction && (
            <button type="button" className="marketBuyBtn cook mt-4" onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
