import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const message = `Sign in to Cookie Words\nWallet: ${address}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;

  return NextResponse.json({ nonce, message });
}

