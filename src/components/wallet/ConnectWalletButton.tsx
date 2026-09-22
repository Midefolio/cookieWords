"use client";

import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function ConnectWalletButton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <WalletMultiButton />
    </div>
  );
}

