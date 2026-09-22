"use client";

import React, { useState } from "react";

interface MarketModalProps {
  show: boolean;
  crumbs: number;
  xp: number;
  cookBalance: number;
  onClose: () => void;
  onBuyCrumbWithXp: () => Promise<boolean>;
  onBuyXpWithCook: () => Promise<boolean>;
}

type PurchaseKind = "crumb" | "xp";

export function MarketModal({
  show,
  crumbs,
  xp,
  cookBalance,
  onClose,
  onBuyCrumbWithXp,
  onBuyXpWithCook,
}: MarketModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  if (!show) return null;

  const purchase = async (kind: PurchaseKind) => {
    setLoading(true);
    const bought = kind === "crumb"
      ? await onBuyCrumbWithXp()
      : await onBuyXpWithCook();
    setLoading(false);
    if (bought) {
      setSuccess(kind === "crumb" ? "1 crumb added to your jar!" : kind === "xp" ? "100 XP added to your balance!" : "Combo Box added: 100 XP and 3 crumbs!");
    }
  };

  return (
    <div className="marketModal" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="marketPanel">
        <button className="marketCloseBtn" type="button" onClick={onClose}>✕</button>
        <div className="marketTitle">✦ Crumb Market</div>

        <div className="marketBalances">
          <span className="marketBalance"><span className="crumbBalanceIcon">✦</span>{crumbs}</span>
          <span className="marketBalance">⭐ {xp} XP</span>
          <span className="marketBalance">🪙 {cookBalance.toFixed(2)} $COOK</span>
        </div>

        <div className="marketItem">
          <div className="marketItemInfo">
            <span className="marketItemIcon" aria-hidden="true">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="13" fill="#D9A968" stroke="#241207" strokeWidth="1.5" />
                <circle cx="11" cy="12" r="1.6" fill="#6b4423" />
                <circle cx="20" cy="10" r="1.4" fill="#6b4423" />
                <circle cx="21" cy="19" r="1.6" fill="#6b4423" />
              </svg>
            </span>
            <div>
              <div className="marketItemName">1 Crumb</div>
              <div className="marketItemDesc">50 XP each</div>
            </div>
          </div>
          <button
            className="marketBuyBtn"
            type="button"
            disabled={loading || xp < 50}
            onClick={() => purchase("crumb")}
            style={{ opacity: xp >= 50 ? 1 : 0.55 }}
          >
            Buy
          </button>
        </div>

        <div className="marketItem">
          <div className="marketItemInfo">
            <span className="marketItemIcon" aria-hidden="true">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="13" fill="#FFDE7A" stroke="#241207" strokeWidth="1.5" />
                <text x="16" y="21" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="13" fill="#241207" textAnchor="middle">
                  XP
                </text>
              </svg>
            </span>
            <div>
              <div className="marketItemName">100 XP</div>
              <div className="marketItemDesc">1 $COOK each (Cookie Chain native)</div>
            </div>
          </div>
          <button
            className="marketBuyBtn cook"
            type="button"
            disabled={loading || cookBalance < 1}
            onClick={() => purchase("xp")}
            style={{ opacity: cookBalance >= 1 ? 1 : 0.55 }}
          >
            Buy
          </button>
        </div>

        <div className="text-center text-xs text-textMuted mt-4 opacity-75">
          Connected to Cookie Chain SVM
        </div>

        {success && (
          <div className="purchaseSuccessModal" role="status">
            <div className="purchaseSuccessCard">
              <div className="purchaseSuccessIcon">✓</div>
              <strong>Purchase successful!</strong>
              <p>{success}</p>
              <button className="marketBuyBtn cook" type="button" onClick={() => setSuccess(null)}>Nice!</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
