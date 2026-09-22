"use client";

import React, { useEffect, useState } from "react";
import { LeaderboardTable, LeaderboardEntry } from "@/components/leaderboard/LeaderboardTable";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setEntries(data.leaderboard || []);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-4">
      <LeaderboardTable entries={entries} loading={loading} />
    </main>
  );
}

