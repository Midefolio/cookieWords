"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface CelebrationModalProps {
  show: boolean;
  word: string;
  attempts: number;
  elapsedSeconds: number;
  streakDays: number;
  xpEarned: number;
  rankDisplay: string;
  clue?: string;
  won?: boolean;
  onShare: () => void;
  onNextRound: () => void;
  onBackToLobby: () => void;
}

export function CelebrationModal({
  show,
  word,
  attempts,
  elapsedSeconds,
  streakDays,
  xpEarned,
  rankDisplay,
  clue,
  won = true,
  onShare,
  onNextRound,
  onBackToLobby,
}: CelebrationModalProps) {
  useEffect(() => {
    if (show) {
      createTopDownConfetti();
    }
  }, [show]);

  const createTopDownConfetti = () => {
    const colors = ["#F4C95D", "#8EE08F", "#E9D9B4", "#C9955B", "#FFC93C", "#4ADE6E"];
    for (let i = 0; i < 70; i++) {
      const conf = document.createElement("div");
      conf.className = "confetti";
      conf.style.left = `${Math.random() * 100}vw`;
      conf.style.top = `${-10 - Math.random() * 18}vh`;
      conf.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, #7A5330 70%)`;
      document.body.appendChild(conf);

      const duration = 2.2 + Math.random() * 1.8;
      const xDrift = (Math.random() - 0.5) * 260;
      const yDrift = 420 + Math.random() * 520;

      setTimeout(() => {
        conf.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        conf.style.transform = `translate(${xDrift}px, ${yDrift}px) rotate(${Math.random() * 720}deg) scale(0.4)`;
        conf.style.opacity = "0";
      }, 10);

      setTimeout(() => conf.remove(), duration * 1000 + 200);
    }
  };

  if (!show) return null;

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="celebrationModal show">
      <div className="celebrationCard">
        <div className="cookieGlowWrap">
          {/* <div className="cookieGlow" /> */}
          <img
            className="celebrationCookie"
            src={won ? "/happycookie.png" : "/sadcookie.png"}
            alt={won ? "Happy cookie" : "Sad cookie"}
          />
        </div>

        <div className="celebrationText">{won ? "You cracked it!" : "Better luck next time!"}</div>

        <div className="performanceRemark">
          {won ? (attempts <= 2 ? "A crumb-tastic performance!" : attempts <= 4 ? "Great baking instincts!" : "You kept your cool!") : "The oven got the better of this round."}
        </div>
        {won && <div className="starRating" aria-label={`${attempts <= 2 ? 3 : attempts <= 4 ? 2 : 1} star rating`}>
          {"★★★".split("").map((star, index) => (
            <span key={index} className={index < (attempts <= 2 ? 3 : attempts <= 4 ? 2 : 1) ? "star active" : "star"}>{star}</span>
          ))}
        </div>}
        {clue && <div className="resultClue"><strong>Clue:</strong> {clue}</div>}

        <div className="resultTiles">
          {word.split("").map((ch, i) => (
            <div
              key={i}
              className="resultTile"
              style={{ animationDelay: `${(i * 0.08).toFixed(2)}s` }}
            >
              {ch}
            </div>
          ))}
        </div>

        <div className="celebrationDivider" />

        <div className="celebrationStats">
          <div className="statCol">
            <div className="statLabel">Solved in</div>
            <div className="statValue">
              {won ? `${attempts}/6 · ${formatTime(elapsedSeconds)}` : `6/6 · ${formatTime(elapsedSeconds)}`}
            </div>
          </div>
          <div className="statCol">
            <div className="statLabel">🔥 {streakDays} Day Streak</div>
            <div className="statValueGreen">(+{xpEarned} XP)</div>
          </div>
          <div className="statCol">
            <div className="statLabel">🏆 Rank</div>
            <div className="statValue">{rankDisplay}</div>
          </div>
        </div>

        <button className="shareBtn" type="button" onClick={onShare}>
          Share Result
        </button>

        <div className="flex gap-2 mt-2">
          <Link href="/leaderboard" className="leaderboardBtn flex-1 flex items-center justify-center">
            View Leaderboard
          </Link>
          <button className="shareBtn flex-1" style={{ background: "linear-gradient(180deg, #6a4a2c, #33210f)", color: "#FFF8EA" }} onClick={onNextRound}>
            Next Round 🍪
          </button>
        </div>
        <button className="textButton mt-3" type="button" onClick={onBackToLobby}>Back to Lobby</button>
      </div>
    </div>
  );
}