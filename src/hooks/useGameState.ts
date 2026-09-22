"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { TileState, scoreGuess } from "@/lib/scoring";
import { useTimer } from "./useTimer";

export type GameMode = "easy" | "medium" | "hard";

export function useGameState(initialPlayerData?: any, mode: GameMode = "easy") {
  const ROWS = 6;
  const [secretWord, setSecretWord] = useState<string>("");
  const [hintData, setHintData] = useState<any>(null);
  const [cols, setCols] = useState<number>(5);

  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentCol, setCurrentCol] = useState<number>(0);
  const [board, setBoard] = useState<string[][]>(() =>
    Array.from({ length: 6 }, () => Array(5).fill(""))
  );
  const [gridStates, setGridStates] = useState<TileState[][]>(() =>
    Array.from({ length: 6 }, () => Array(5).fill("empty"))
  );
  const [flippingRow, setFlippingRow] = useState<number | null>(null);
  const [correct3DTiles, setCorrect3DTiles] = useState<Record<string, boolean>>({});
  const [keyStates, setKeyStates] = useState<Record<string, TileState>>({});

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [clueUsed, setClueUsed] = useState<boolean>(false);
  const [letterUsed, setLetterUsed] = useState<boolean>(false);
  const [revealedPositions, setRevealedPositions] = useState<number[]>([]);

  // Economy state
  const [crumbs, setCrumbs] = useState<number>(initialPlayerData?.crumbs ?? 6);
  const [xp, setXp] = useState<number>(initialPlayerData?.xp ?? 150);
  const [cookBalance, setCookBalance] = useState<number>(5);
  const [streakDays, setStreakDays] = useState<number>(initialPlayerData?.streakDays ?? 0);
  const [rankDisplay, setRankDisplay] = useState<string>("#1");

  // Modals & UI
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showLoss, setShowLoss] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMarket, setShowMarket] = useState<boolean>(false);
  const [hintModalConfig, setHintModalConfig] = useState<{
    show: boolean;
    title: string;
    emoji?: string;
    letter?: string;
    text: string;
  }>({ show: false, title: "", text: "" });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const crumbRequestInFlight = useRef(false);

  const { elapsedSeconds, isRunning, startTimer, stopTimer } = useTimer();

  const showToast = useCallback((msg: string, duration = 1600) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, duration);
  }, []);

  const fetchNewWord = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/game/new-word?mode=${mode}`);
      if (!res.ok) throw new Error("Failed to fetch new word");
      const data = await res.json();

      const newWord = data.word.toUpperCase();
      setSecretWord(newWord);
      setHintData(data.hint);
      const wordLen = newWord.length;
      setCols(wordLen);

      // Reset round board state
      setCurrentRow(0);
      setCurrentCol(0);
      setBoard(Array.from({ length: ROWS }, () => Array(wordLen).fill("")));
      setGridStates(Array.from({ length: ROWS }, () => Array(wordLen).fill("empty")));
      setKeyStates({});
      setCorrect3DTiles({});
      setFlippingRow(null);
      setGameOver(false);
      setClueUsed(false);
      setLetterUsed(false);
      setRevealedPositions([]);
      setShowCelebration(false);
      setShowLoss(false);

      startTimer();
    } catch (err: any) {
      console.error("fetchNewWord error:", err);
      showToast("Error loading word");
    } finally {
      setIsLoading(false);
    }
  }, [ROWS, mode, startTimer, showToast]);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch("/api/market/balance");
      if (res.ok) {
        const data = await res.json();
        setCrumbs(data.crumbs);
        setXp(data.xp);
        setCookBalance(data.cookBalance);
      }
    } catch (err) {
      console.warn("fetchBalance error:", err);
    }
  }, []);

  useEffect(() => {
    fetchNewWord();
    fetchBalance();
  }, [fetchNewWord, fetchBalance]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver || !secretWord) return;

      if (key === "Backspace") {
        if (currentCol > 0) {
          const nextCol = currentCol - 1;
          setCurrentCol(nextCol);
          setBoard((prev) => {
            const copy = prev.map((r) => [...r]);
            copy[currentRow][nextCol] = "";
            return copy;
          });
          setGridStates((prev) => {
            const copy = prev.map((r) => [...r]);
            copy[currentRow][nextCol] = "empty";
            return copy;
          });
        }
        return;
      }

      if (key === "Enter") {
        if (currentCol < cols) {
          showToast("Not enough letters");
          return;
        }

        const guess = board[currentRow].join("");
        const resultStates = scoreGuess(guess, secretWord);

        setFlippingRow(currentRow);

        resultStates.forEach((st, i) => {
          setTimeout(() => {
            setGridStates((prev) => {
              const copy = prev.map((r) => [...r]);
              copy[currentRow][i] = st;
              return copy;
            });

            // Update keyboard key state
            setKeyStates((prev) => {
              const letter = guess[i];
              const rank: Record<TileState, number> = { empty: -1, tapped: -1, absent: 0, present: 1, correct: 2 };
              const existing = prev[letter];
              if (!existing || rank[st] > rank[existing]) {
                return { ...prev, [letter]: st };
              }
              return prev;
            });

            if (st === "correct") {
              setCorrect3DTiles((prev) => ({ ...prev, [`${currentRow}-${i}`]: true }));
            }
          }, i * 220);
        });

        const totalDelay = cols * 220 + 500;

        setTimeout(() => {
          setFlippingRow(null);

          const won = guess === secretWord;

          if (won || currentRow === ROWS - 1) {
            stopTimer();
            setGameOver(true);

            // Show UI immediately without waiting for API
            if (won) {
              setShowCelebration(true);
            } else {
              setShowLoss(true);
            }

            // Submit result in background
            fetch("/api/game/submit-result", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                word: secretWord,
                won,
                attempts: currentRow + 1,
                elapsedSeconds,
              }),
            })
              .then(async (res) => {
                if (res.ok) {
                  const resData = await res.json();
                  if (resData.player) {
                    setCrumbs(resData.player.crumbs);
                    setXp(resData.player.xp);
                    setStreakDays(resData.player.streakDays);
                    setRankDisplay(resData.player.rankDisplay || "#1");
                  }
                }
              })
              .catch((err) => {
                console.error("submit-result error:", err);
              });
          } else {
            setCurrentRow((r) => r + 1);
            setCurrentCol(0);
          }
        }, totalDelay);

        return;
      }

      if (/^[a-zA-Z]$/.test(key) && currentCol < cols) {
        const letter = key.toUpperCase();
        setBoard((prev) => {
          const copy = prev.map((r) => [...r]);
          copy[currentRow][currentCol] = letter;
          return copy;
        });
        setGridStates((prev) => {
          const copy = prev.map((r) => [...r]);
          copy[currentRow][currentCol] = "tapped";
          return copy;
        });
        setCurrentCol((c) => c + 1);
      }
    },
    [gameOver, secretWord, currentCol, cols, board, currentRow, ROWS, elapsedSeconds, stopTimer, showToast]
  );

  const consumeCrumbs = async (cost: number): Promise<boolean> => {
    if (crumbRequestInFlight.current) return false;
    crumbRequestInFlight.current = true;
    try {
      const res = await fetch("/api/market/buy-crumbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "consume_crumb", cost }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Unable to use crumbs");
        return false;
      }
      setCrumbs(data.crumbs);
      return true;
    } catch (error) {
      console.error("consume crumbs error:", error);
      showToast("Unable to use crumbs");
      return false;
    } finally {
      crumbRequestInFlight.current = false;
    }
  };

  const handleUseClue = async () => {
    if (gameOver) return;
    if (crumbs <= 0 && !clueUsed) {
      setHintModalConfig({
        show: true,
        title: "No Crumbs Left",
        emoji: "✦",
        text: "Your crumb jar is empty. Visit the Market to bake more clues.",
      });
      return;
    }
    if (!clueUsed) {
      const consumed = await consumeCrumbs(1);
      if (!consumed) return;
      setClueUsed(true);
    }
    setHintModalConfig({
      show: true,
      title: "Clue Crumb",
      emoji: hintData?.emoji1 || "??",
      text: hintData?.clue || "A mysterious cookie word",
    });
  };

  const handleUseLetter = async () => {
    if (gameOver) return;
    const cost = 2 ** revealedPositions.length;
    if (crumbs < cost) {
      setHintModalConfig({
        show: true,
        title: "Not Enough Crumbs",
        emoji: "🍪",
        text: `This letter crumb costs ${cost} crumb${cost === 1 ? "" : "s"}. Visit the Market for more.`,
      });
      return;
    }
    const nextPosition = Array.from({ length: secretWord.length }, (_, index) => index)
      .find((index) => !revealedPositions.includes(index));
    if (nextPosition === undefined) {
      setHintModalConfig({ show: true, title: "All Letters Revealed", emoji: "✨", text: "Every letter is already revealed." });
      return;
    }
    const letter = secretWord[nextPosition];
    const consumed = await consumeCrumbs(cost);
    if (!consumed) return;
    setLetterUsed(true);
    setRevealedPositions((positions) => [...positions, nextPosition]);
    setHintModalConfig({
      show: true,
      title: "Letter Crumb",
      letter,
      text: `Letter ${nextPosition + 1} is "${letter}" (${cost} crumb${cost === 1 ? "" : "s"})`,
    });
  };

  const handleBuyCrumbWithXp = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/market/buy-crumbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "crumb_xp" }),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Failed to buy crumb");
        return false;
      }
      const data = await res.json();
      setCrumbs(data.crumbs);
      setXp(data.xp);
      showToast("Bought 1 Crumb!");
      return true;
    } catch (e) {
      showToast("Purchase failed");
      return false;
    }
  };

  const handleBuyXpWithCook = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/market/buy-crumbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "xp_cook" }),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Failed to buy XP");
        return false;
      }
      const data = await res.json();
      setCrumbs(data.crumbs);
      setXp(data.xp);
      showToast("Bought 100 XP!");
      return true;
    } catch (e) {
      showToast("Purchase failed");
      return false;
    }
  };

  const handleBuyCombo = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/market/buy-crumbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "combo" }),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Combo purchase failed");
        return false;
      }
      const data = await res.json();
      setCrumbs(data.crumbs);
      setXp(data.xp);
      showToast("Combo box added!");
      return true;
    } catch {
      showToast("Combo purchase failed");
      return false;
    }
  };

  return {
    secretWord,
    hintData,
    rows: ROWS,
    cols,
    currentRow,
    currentCol,
    board,
    gridStates,
    keyStates,
    flippingRow,
    correct3DTiles,
    gameOver,
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
    showLoss,
    isLoading,
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
    handleBuyCombo,
    fetchNewWord,
    showToast,
  };
}
