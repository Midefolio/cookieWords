"use client";

import React from "react";
import Link from "next/link";

export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  displayAddress: string;
  totalWins: number;
  streakDays: number;
  xp: number;
  bestTimeSecs?: number | null;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading?: boolean;
}

export function LeaderboardTable({ entries, loading }: LeaderboardTableProps) {
  const formatTime = (totalSecs?: number | null) => {
    if (!totalSecs) return "--:--";
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="gameFrame flex flex-col items-center justify-start p-4 md:p-6 w-full max-w-4xl mx-auto">
      <span className="frameBolt tl" />
      <span className="frameBolt tr" />
      <span className="frameBolt bl" />
      <span className="frameBolt br" />

      <div className="innerPanel w-full flex flex-col gap-4">
        {/* Top navigation */}
        <div className="topBar w-full">
          <Link href="/" className="metaBadge hover:opacity-90 transition-opacity">
            ⬅️ Back to Game
          </Link>
          <div className="logo">
            <span className="letter">C</span>
            <span className="cookie-o">🍪</span>
            <span className="letter">O</span>
            <span className="letter">K</span>
            <span className="letter">I</span>
            <span className="letter">E</span>
            <span className="space" />
            <span className="letter">L</span>
            <span className="letter">E</span>
            <span className="letter">A</span>
            <span className="letter">D</span>
            <span className="letter">E</span>
            <span className="letter">R</span>
            <span className="letter">S</span>
          </div>
          <span className="metaBadge">🏆 Cookie Chain</span>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto w-full rounded-xl bg-cardCreamTop/10 border border-toonInk/40 shadow-inner">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-woodPanelDark/80 text-cookieGold font-heading text-xs uppercase tracking-wider border-b border-toonInk/40">
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Wallet</th>
                <th className="py-3 px-4 text-center">Wins</th>
                <th className="py-3 px-4 text-center">Streak</th>
                <th className="py-3 px-4 text-center">XP</th>
                <th className="py-3 px-4 text-center">Best Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-toonInk/20 font-body text-sm text-textPrimary">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-textMuted font-bold">
                    Loading leaderboard standings... 🍪
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-textMuted font-bold">
                    No games recorded yet. Be the first to win a round!
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr
                    key={entry.walletAddress}
                    className="hover:bg-woodPanel/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-heading font-extrabold">
                      {entry.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cookieGold text-textDark shadow">
                          🥇
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-300 text-textDark shadow">
                          🥈
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white shadow">
                          🥉
                        </span>
                      ) : (
                        `#${entry.rank}`
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-cookieCream">
                      {entry.displayAddress}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-correctGreen">
                      {entry.totalWins}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-presentYellow">
                      🔥 {entry.streakDays}d
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-cookieGold">
                      ⭐ {entry.xp}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-xs text-textMuted">
                      ⏱️ {formatTime(entry.bestTimeSecs)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

