"use client";

import React, { useEffect } from "react";
import { WalletGate } from "@/components/wallet/WalletGate";
import { TimerBadge } from "@/components/game/TimerBadge";
import { CrumbRow } from "@/components/game/CrumbRow";
import { HintFrame } from "@/components/game/HintFrame";
import { GameBoard } from "@/components/game/GameBoard";
import { Toast } from "@/components/game/Toast";
import { CelebrationModal } from "@/components/game/CelebrationModal";
import { MarketModal } from "@/components/market/MarketModal";
import { HintModal } from "@/components/market/HintModal";
import { useGameState } from "@/hooks/useGameState";
import { GameMode } from "@/hooks/useGameState";

function GameScreen({ mode = "easy", playerData, onEndGame }: { mode?: GameMode; playerData?: any; onEndGame?: () => void }) {
  const {
    secretWord,
    hintData,
    rows,
    cols,
    currentRow,
    board,
    gridStates,
    keyStates,
    flippingRow,
    correct3DTiles,
    clueUsed,
    letterUsed,
    crumbs,
    xp,
    cookBalance,
    streakDays,
    rankDisplay,
    elapsedSeconds,
    isRunning,
    showCelebration,
    showMarket,
    hintModalConfig,
    toastMessage,
    setShowMarket,
    setHintModalConfig,
    handleKey,
    handleUseClue,
    handleUseLetter,
    handleBuyCrumbWithXp,
    handleBuyXpWithCook,
    fetchNewWord,
    showToast,
    showLoss,
    isLoading,
  } = useGameState(playerData, mode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") handleKey("Enter");
      else if (e.key === "Backspace") handleKey("Backspace");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKey]);

  const handleShareResult = () => {
    const text = `Cookie Words ${currentRow + 1}/${rows} 🍪 ${streakDays}-day streak!`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast("Result copied to clipboard!"),
        () => showToast("Couldn't copy — try again")
      );
    } else {
      showToast("Result copied to clipboard!");
    }
  };

  return (
    <>
      <TimerBadge elapsedSeconds={elapsedSeconds} stopped={!isRunning} />

      <div className="gameFrame">
        <span className="frameBolt tl" />
        <span className="frameBolt tr" />
        <span className="frameBolt bl" />
        <span className="frameBolt br" />

        <div className="innerPanel">
          <div className="topBar">
            <span className="metaBadge">⭐ {xp} XP</span>
            <div className="logo">
              <span className="letter">C</span>
              <span className="cookie-o">🍪</span>
              <span className="letter">O</span>
              <span className="letter">K</span>
              <span className="letter">I</span>
              <span className="letter">E</span>
              <span className="space" />
              <span className="letter">W</span>
              <span className="cookie-o">🍪</span>
              <span className="letter">R</span>
              <span className="letter">D</span>
              <span className="letter">S</span>
            </div>
            <div className="topBarActions">
              <span className="metaBadge">🏆 {rankDisplay}</span>
              <button type="button" className="endGameBtn" onClick={onEndGame}>End Game</button>
            </div>
          </div>

          <CrumbRow
            crumbs={crumbs}
            clueUsed={clueUsed}
            letterUsed={letterUsed}
            onUseClue={handleUseClue}
            onUseLetter={handleUseLetter}
            onOpenMarket={() => setShowMarket(true)}
          />

          <div className="gameBody">
            <HintFrame
              emoji={hintData?.emoji1 || "🍪"}
              label="CLUE"
              revealed={clueUsed}
            />

            <GameBoard
              rows={rows}
              cols={cols}
              board={board}
              gridStates={gridStates}
              keyStates={keyStates}
              flippingRow={flippingRow}
              correct3DTiles={correct3DTiles}
              onKey={handleKey}
            />

            <HintFrame
              emoji={hintData?.emoji2 || "✨"}
              label="LETTER"
              revealed={letterUsed}
            />
          </div>
        </div>
      </div>

      <MarketModal
        show={showMarket}
        crumbs={crumbs}
        xp={xp}
        cookBalance={cookBalance}
        onClose={() => setShowMarket(false)}
        onBuyCrumbWithXp={handleBuyCrumbWithXp}
        onBuyXpWithCook={handleBuyXpWithCook}
      />

      <HintModal
        show={hintModalConfig.show}
        title={hintModalConfig.title}
        emoji={hintModalConfig.emoji}
        letter={hintModalConfig.letter}
        text={hintModalConfig.text}
        actionLabel={["Not Enough Crumbs", "No Crumbs Left"].includes(hintModalConfig.title) ? "Go to Market" : undefined}
        onAction={["Not Enough Crumbs", "No Crumbs Left"].includes(hintModalConfig.title) ? () => {
          setHintModalConfig((prev) => ({ ...prev, show: false }));
          setShowMarket(true);
        } : undefined}
        onClose={() => setHintModalConfig((prev) => ({ ...prev, show: false }))}
      />

      <CelebrationModal
        show={showCelebration}
        word={secretWord}
        attempts={currentRow + 1}
        elapsedSeconds={elapsedSeconds}
        streakDays={streakDays}
        xpEarned={20}
        rankDisplay={rankDisplay}
        clue={hintData?.clue}
        won
        onShare={handleShareResult}
        onNextRound={fetchNewWord}
        onBackToLobby={onEndGame || (() => undefined)}
      />

      <CelebrationModal
        show={showLoss}
        word={secretWord}
        attempts={6}
        elapsedSeconds={elapsedSeconds}
        streakDays={streakDays}
        xpEarned={0}
        rankDisplay={rankDisplay}
        clue={hintData?.clue}
        won={false}
        onShare={handleShareResult}
        onNextRound={fetchNewWord}
        onBackToLobby={onEndGame || (() => undefined)}
      />

      <Toast message={toastMessage} />
      {isLoading && <div className="loadingModal show"><div className="loadingCard"><div className="loadingSpinner" />Baking your next word...</div></div>}
    </>
  );
}

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen p-[clamp(6px,1.5vh,18px)] w-full">
      <WalletGate>
        <GameScreen />
      </WalletGate>
    </div>
  );
}
