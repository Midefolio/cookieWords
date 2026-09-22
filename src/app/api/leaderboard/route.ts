import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connect";
import { Player } from "@/models/Player";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const players = await Player.find()
      .sort({ totalWins: -1, bestTimeSecs: 1, streakDays: -1 })
      .limit(50)
      .lean();

    const leaderboard = players.map((p, index) => {
      const addr = p.walletAddress;
      const truncated = addr.length > 8 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr;

      return {
        rank: index + 1,
        walletAddress: p.walletAddress,
        displayAddress: truncated,
        totalWins: p.totalWins || 0,
        streakDays: p.streakDays || 0,
        xp: p.xp || 0,
        bestTimeSecs: p.bestTimeSecs || null,
      };
    });

    return NextResponse.json({ leaderboard });
  } catch (error: any) {
    console.error("leaderboard error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch leaderboard" }, { status: 500 });
  }
}

