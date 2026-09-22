"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
import { GameMode } from "@/hooks/useGameState";

interface WalletGateProps {
  children: React.ReactNode;
  onAuthenticated?: (playerData: any) => void;
}

export function WalletGate({ children, onAuthenticated }: WalletGateProps) {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [mode, setMode] = useState<GameMode>("easy");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(async () => {
    if (document.fullscreenElement) return;
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.warn("Fullscreen request was blocked by the browser:", error);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange();
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleAuthenticate = useCallback(async () => {
    if (!publicKey || !signMessage) return;

    try {
      setIsAuthenticating(true);
      setAuthError(null);

      const addressStr = publicKey.toBase58();

      // Step 1: Fetch nonce message
      const nonceRes = await fetch(`/api/auth/nonce?address=${encodeURIComponent(addressStr)}`);
      if (!nonceRes.ok) throw new Error("Failed to fetch signature challenge");
      const { message } = await nonceRes.json();

      // Step 2: Sign message with wallet
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(messageBytes);
      const signatureStr = bs58.encode(signatureBytes);

      // Step 3: Verify with backend
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: addressStr,
          signature: signatureStr,
          message,
        }),
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json().catch(() => ({}));
        throw new Error(errData.error || "Signature verification failed");
      }

      const data = await verifyRes.json();
      setPlayer(data.player);
      setIsAuthenticated(true);
      void enterFullscreen();
      if (onAuthenticated) {
        onAuthenticated(data.player);
      }
    } catch (err: any) {
      console.error("Wallet auth error:", err);
      setAuthError(err.message || "Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  }, [publicKey, signMessage, onAuthenticated, enterFullscreen]);

  useEffect(() => {
    if (connected && publicKey && !isAuthenticated && !isAuthenticating) {
      handleAuthenticate();
    }
    if (!connected) {
      setIsAuthenticated(false);
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch((error) => {
          console.error("Unable to exit fullscreen:", error);
        });
      }
    }
  }, [connected, publicKey, isAuthenticated, isAuthenticating, handleAuthenticate]);

  if (isAuthenticated && connected) {
    if (isPlaying) {
      return React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ mode: GameMode; onEndGame: () => void; playerData: any }>, {
            mode,
            playerData: player,
            onEndGame: () => setIsPlaying(false),
          })
        : children;
    }

    return (
      <div className="gameFrame flex flex-col items-center justify-center p-6 text-center">
        <span className="frameBolt tl" /><span className="frameBolt tr" /><span className="frameBolt bl" /><span className="frameBolt br" />
        <div className="innerPanel lobbyPanel">
          {!isFullscreen && (
            <button type="button" className="fullscreenPrompt" onClick={() => void enterFullscreen()}>
              ⛶ Enter fullscreen for the best experience
            </button>
          )}
          <div className="logo text-2xl font-extrabold">🍪 COOKIE WORDS 🍪</div>
          <div className="walletIdentity">
            <span>Connected wallet</span>
            <strong>{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</strong>
          </div>
          <div className="lobbyStats">
            <div><strong>{player?.streakDays ?? 0}</strong><span>Streak</span></div>
            <div><strong>{player?.rankDisplay ?? "#1"}</strong><span>Rank</span></div>
            <div><strong>{player?.bestTimeSecs ? `${player.bestTimeSecs}s` : `${player?.totalWins ?? 0} wins`}</strong><span>Best</span></div>
          </div>
          <div className="modePicker">
            <div className="modePickerTitle">Choose your bake</div>
            <div className="modeOptions">
              {(["easy", "medium", "hard"] as GameMode[]).map((option) => (
                <button key={option} type="button" className={`modeOption ${mode === option ? "selected" : ""}`} onClick={() => setMode(option)}>
                  <strong>{option[0].toUpperCase() + option.slice(1)}</strong>
                  <span>{option === "easy" ? "Common baking words" : option === "medium" ? "Broader vocabulary" : "Rare and longer words"}</span>
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="playNowBtn" onClick={() => setIsPlaying(true)}>Play Now 🍪</button>
          <div className="lobbyActions">
            <button type="button" className="textButton" onClick={() => disconnect()}>Disconnect wallet</button>
            <Link href="/" className="textButton">Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gameFrame flex flex-col items-center justify-center p-6 text-center">
      <span className="frameBolt tl" />
      <span className="frameBolt tr" />
      <span className="frameBolt bl" />
      <span className="frameBolt br" />

      <div className="innerPanel flex-1 flex flex-col items-center justify-center p-8 gap-6 w-full">
        <div className="logo text-2xl font-extrabold mb-2">
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

        <div className="text-cookieCream text-2xl font-bold opacity-90 max-w-md leading-relaxed">
          Connect your wallet to start playing!
        </div>

        <div className="my-2">
          <WalletMultiButton />
        </div>

        {connected && !isAuthenticated && (
          <button
            onClick={handleAuthenticate}
            disabled={isAuthenticating}
            className="marketBuyBtn cook px-6 py-3 text-sm font-extrabold uppercase tracking-wide"
          >
            {isAuthenticating ? "Verifying Signature..." : "Sign in to Play"}
          </button>
        )}

        {authError && (
          <div className="text-red-400 text-xs font-bold bg-black/40 px-4 py-2 rounded-lg border border-red-500/30">
            {authError}
          </div>
        )}
        {isAuthenticating && <div className="loadingModal show"><div className="loadingCard"><div className="loadingSpinner" />Authenticating wallet...</div></div>}

        {/* <div className="text-xs text-textMuted mt-4 opacity-75">
          Cookie Chain RPC: <code className="text-cookieGold font-mono">https://rpc.cookiescan.io</code>
        </div> */}
      </div>
    </div>
  );
}
