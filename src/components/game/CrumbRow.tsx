"use client";

import React, { useState, useEffect } from "react";

interface CrumbRowProps {
  crumbs: number;
  clueUsed: boolean;
  letterUsed: boolean;
  onUseClue: () => void;
  onUseLetter: () => void;
  onOpenMarket: () => void;
}

export function CrumbRow({
  crumbs,
  clueUsed,
  letterUsed,
  onUseClue,
  onUseLetter,
  onOpenMarket,
}: CrumbRowProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 300);
    return () => clearTimeout(t);
  }, [crumbs]);

  return (
    <div className="crumbRow">
      <button
        className={`crumbChip ${!clueUsed && crumbs <= 0 ? "disabled" : ""}`}
        type="button"
        onClick={onUseClue}
        title="Spend a crumb to reveal a clue"
      >
        <span className="crumbIconWrap clue">
          <svg className="crumbIcon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="scrollGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF7DE" />
                <stop offset="100%" stopColor="#E9D9B4" />
              </linearGradient>
            </defs>
            <rect x="6" y="4.5" width="20" height="23" rx="3" fill="url(#scrollGrad)" stroke="#241207" strokeWidth="1.5" />
            <line x1="10" y1="11" x2="22" y2="11" stroke="#B9793D" strokeWidth="1.7" strokeLinecap="round" />
            <line x1="10" y1="16" x2="22" y2="16" stroke="#B9793D" strokeWidth="1.7" strokeLinecap="round" />
            <line x1="10" y1="21" x2="18" y2="21" stroke="#B9793D" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <span className="crumbLabel">Clue Crumb</span>
      </button>

      <button
        className={`crumbChip ${!letterUsed && crumbs <= 0 ? "disabled" : ""}`}
        type="button"
        onClick={onUseLetter}
        title="Spend a crumb to unlock a letter"
      >
        <span className="crumbIconWrap letter">
          <svg className="crumbIcon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="letterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D9A968" />
                <stop offset="100%" stopColor="#B27C43" />
              </linearGradient>
            </defs>
            <rect x="5" y="5" width="22" height="22" rx="6" fill="url(#letterGrad)" stroke="#241207" strokeWidth="1.5" />
            <text x="16" y="22" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="14" fill="#FFF8EA" textAnchor="middle">
              A
            </text>
          </svg>
        </span>
        <span className="crumbLabel">Letter Crumb (1,2,4...)</span>
      </button>

      <span
        className="crumbChip count"
        style={{
          transform: pulse ? "scale(1.25)" : "scale(1)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        title="Crumbs available"
      >
        <span className="crumbIconWrap crumbPiecesIcon" aria-label="crumbs">
          <svg viewBox="0 0 32 32" className="crumbIcon" aria-hidden="true">
            <circle cx="10" cy="12" r="4" fill="#b9793d" />
            <circle cx="20" cy="10" r="3" fill="#d9a968" />
            <circle cx="19" cy="21" r="5" fill="#a96835" />
            <circle cx="8" cy="22" r="2.5" fill="#f4c95d" />
          </svg>
        </span>
        <span className="crumbLabel">x{crumbs}</span>
      </span>

      <button className="crumbChip market" type="button" onClick={onOpenMarket} title="Open the Market">
        <span className="crumbIconWrap market">
          <svg className="crumbIcon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bagGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFDE7A" />
                <stop offset="100%" stopColor="#B9722A" />
              </linearGradient>
            </defs>
            <path d="M9 12 L11 6 H21 L23 12 Z" fill="none" stroke="#241207" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="7" y="12" width="18" height="14" rx="3" fill="url(#bagGrad)" stroke="#241207" strokeWidth="1.5" />
            <text x="16" y="22.5" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="11" fill="#241207" textAnchor="middle">
              $
            </text>
          </svg>
        </span>
        <span className="crumbLabel">Market</span>
      </button>

      <div className="crumbChip solo" title="Playing solo">
        <span className="crumbIconWrap solo">🧑</span>
        <span className="crumbLabel">Solo Play</span>
      </div>
    </div>
  );
}
