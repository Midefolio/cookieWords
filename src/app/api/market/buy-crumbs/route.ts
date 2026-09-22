import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { dbConnect } from "@/lib/db/connect";
import { Player } from "@/models/Player";
import { getSessionWalletAddress } from "@/lib/session";

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_COOKIE_CHAIN_RPC_URL || "https://rpc.cookiescan.io";

export async function POST(req: NextRequest) {
  try {
    const walletAddress = await getSessionWalletAddress();
    if (!walletAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, cost } = await req.json();

    await dbConnect();
    const player = await Player.findOne({ walletAddress });
    if (!player) {
      return NextResponse.json({ error: "Player record not found" }, { status: 404 });
    }

    if (type === "crumb_xp") {
      const CRUMB_PRICE_XP = 50;
      if (player.xp < CRUMB_PRICE_XP) {
        return NextResponse.json({ error: "Not enough XP" }, { status: 400 });
      }
      player.xp -= CRUMB_PRICE_XP;
      player.crumbs += 1;
      await player.save();
    } else if (type === "xp_cook") {
      const XP_PRICE_COOK = 1;
      const XP_REWARD = 100;

      // Verify native COOK balance on Cookie Chain
      let hasBalance = true;
      try {
        const connection = new Connection(RPC_ENDPOINT, "confirmed");
        const pubkey = new PublicKey(walletAddress);
        const lamports = await connection.getBalance(pubkey);
        const cookBalance = lamports / LAMPORTS_PER_SOL;
        if (cookBalance < XP_PRICE_COOK) {
          hasBalance = false;
        }
      } catch (err) {
        console.warn("RPC balance check failed:", err);
      }

      if (!hasBalance) {
        return NextResponse.json({ error: "Not enough $COOK balance on Cookie Chain" }, { status: 400 });
      }

      player.xp += XP_REWARD;
      await player.save();
    } else if (type === "combo") {
      const COMBO_PRICE_COOK = 3;
      let cookBalance = 0;
      try {
        const connection = new Connection(RPC_ENDPOINT, "confirmed");
        const pubkey = new PublicKey(walletAddress);
        cookBalance = (await connection.getBalance(pubkey)) / LAMPORTS_PER_SOL;
      } catch (err) {
        console.warn("RPC balance check failed:", err);
      }
      if (cookBalance < COMBO_PRICE_COOK) {
        return NextResponse.json({ error: "Not enough $COOK for the Combo Box" }, { status: 400 });
      }
      player.xp += 100;
      player.crumbs += 3;
      await player.save();
    } else if (type === "consume_crumb") {
      if (!Number.isInteger(cost) || cost < 1) {
        return NextResponse.json({ error: "Invalid crumb cost" }, { status: 400 });
      }

      const updatedPlayer = await Player.findOneAndUpdate(
        { walletAddress, crumbs: { $gte: cost } },
        { $inc: { crumbs: -cost } },
        { new: true }
      );

      if (!updatedPlayer) {
        return NextResponse.json({ error: "Not enough crumbs" }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        crumbs: updatedPlayer.crumbs,
        xp: updatedPlayer.xp,
      });
    } else {
      return NextResponse.json({ error: "Invalid purchase type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      crumbs: player.crumbs,
      xp: player.xp,
    });
  } catch (error: any) {
    console.error("buy-crumbs error:", error);
    return NextResponse.json({ error: error.message || "Purchase failed" }, { status: 500 });
  }
}
