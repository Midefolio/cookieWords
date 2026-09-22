import { NextRequest, NextResponse } from "next/server";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { dbConnect } from "@/lib/db/connect";
import { Player } from "@/models/Player";
import { setSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { address, signature, message } = await req.json();

    if (!address || !signature || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(address);

    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature challenge verification" }, { status: 401 });
    }

    await dbConnect();

    let player = await Player.findOne({ walletAddress: address });
    if (!player) {
      player = await Player.create({
        walletAddress: address,
        crumbs: 6,
        xp: 150,
        streakDays: 0,
        totalWins: 0,
      });
    }

    await setSessionCookie(address);
    const rankedPlayers = await Player.find().sort({ totalWins: -1, bestTimeSecs: 1 }).select("walletAddress");
    const rankIndex = rankedPlayers.findIndex((entry) => entry.walletAddress === address);

    return NextResponse.json({
      success: true,
      player: {
        walletAddress: player.walletAddress,
        crumbs: player.crumbs,
        xp: player.xp,
        streakDays: player.streakDays,
        totalWins: player.totalWins,
        bestTimeSecs: player.bestTimeSecs,
        rankDisplay: rankIndex >= 0 ? `#${rankIndex + 1}` : "#1",
      },
    });
  } catch (error: any) {
    console.error("Auth verify error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify signature" }, { status: 500 });
  }
}
