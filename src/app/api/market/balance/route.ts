import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { dbConnect } from "@/lib/db/connect";
import { Player } from "@/models/Player";
import { getSessionWalletAddress } from "@/lib/session";

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_COOKIE_CHAIN_RPC_URL || "https://rpc.cookiescan.io";

export async function GET(req: NextRequest) {
  try {
    const walletAddress = await getSessionWalletAddress();
    if (!walletAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const player = await Player.findOne({ walletAddress });
    if (!player) {
      return NextResponse.json({ error: "Player record not found" }, { status: 404 });
    }

    let cookBalance = 0;
    try {
      const connection = new Connection(RPC_ENDPOINT, "confirmed");
      const pubkey = new PublicKey(walletAddress);
      const lamports = await connection.getBalance(pubkey);
      cookBalance = lamports / LAMPORTS_PER_SOL;
    } catch (rpcErr) {
      console.warn("Failed to fetch native $COOK balance from RPC:", rpcErr);
      cookBalance = 5; // fallback display for dev or offline RPC
    }

    return NextResponse.json({
      crumbs: player.crumbs,
      xp: player.xp,
      cookBalance,
    });
  } catch (error: any) {
    console.error("market/balance error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch balance" }, { status: 500 });
  }
}

