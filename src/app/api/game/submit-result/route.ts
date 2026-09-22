import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connect";
import { Player } from "@/models/Player";
import { SeenWord } from "@/models/SeenWord";
import { getSessionWalletAddress } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const walletAddress = await getSessionWalletAddress();
    if (!walletAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { word, won, attempts, elapsedSeconds } = await req.json();
    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    await dbConnect();

    const player = await Player.findOne({ walletAddress });
    if (!player) {
      return NextResponse.json({ error: "Player record not found" }, { status: 404 });
    }

    // Record seen word
    try {
      await SeenWord.create({ walletAddress, word: word.toUpperCase() });
    } catch (e) {
      // Ignore unique constraint error if already recorded
    }

    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    let newStreak = player.streakDays || 0;

    if (won) {
      player.totalWins += 1;
      player.xp += 20;

      if (!player.bestTimeSecs || elapsedSeconds < player.bestTimeSecs) {
        player.bestTimeSecs = elapsedSeconds;
      }

      if (player.lastPlayedAt) {
        const lastDate = new Date(player.lastPlayedAt);
        const lastUTC = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate()));

        const diffTime = todayUTC.getTime() - lastUTC.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        } else if (diffDays === 0) {
          // Already played today, streak remains same or initializes if 0
          if (newStreak === 0) newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      player.streakDays = newStreak;
      player.lastPlayedAt = now;
    } else {
      player.xp += 5;
    }

    await player.save();

    // Determine current global rank
    const topPlayers = await Player.find().sort({ totalWins: -1, bestTimeSecs: 1 });
    const rankIndex = topPlayers.findIndex((p) => p.walletAddress === walletAddress);
    const rankDisplay = rankIndex !== -1 ? `#${rankIndex + 1}` : "#1";

    return NextResponse.json({
      success: true,
      player: {
        walletAddress: player.walletAddress,
        crumbs: player.crumbs,
        xp: player.xp,
        streakDays: player.streakDays,
        totalWins: player.totalWins,
        bestTimeSecs: player.bestTimeSecs,
        rankDisplay,
      },
    });
  } catch (error: any) {
    console.error("submit-result error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit result" }, { status: 500 });
  }
}

