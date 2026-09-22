function calculateStreak(
  currentStreak: number,
  lastPlayedAt: Date | null,
  nowDate: Date
): number {
  const todayUTC = new Date(
    Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate())
  );

  if (!lastPlayedAt) return 1;

  const lastUTC = new Date(
    Date.UTC(
      lastPlayedAt.getUTCFullYear(),
      lastPlayedAt.getUTCMonth(),
      lastPlayedAt.getUTCDate()
    )
  );

  const diffTime = todayUTC.getTime() - lastUTC.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  if (diffDays === 1) {
    return currentStreak + 1;
  } else if (diffDays === 0) {
    return currentStreak === 0 ? 1 : currentStreak;
  } else {
    return 1;
  }
}

describe("Streak Calculation Rules", () => {
  const now = new Date("2026-09-15T14:00:00Z");

  test("First time playing awards 1-day streak", () => {
    const streak = calculateStreak(0, null, now);
    expect(streak).toBe(1);
  });

  test("Playing yesterday increments streak by 1", () => {
    const yesterday = new Date("2026-09-14T18:00:00Z");
    const streak = calculateStreak(5, yesterday, now);
    expect(streak).toBe(6);
  });

  test("Playing again today does not double-count streak", () => {
    const earlierToday = new Date("2026-09-15T08:00:00Z");
    const streak = calculateStreak(5, earlierToday, now);
    expect(streak).toBe(5);
  });

  test("Missing a day resets streak to 1", () => {
    const threeDaysAgo = new Date("2026-09-12T14:00:00Z");
    const streak = calculateStreak(10, threeDaysAgo, now);
    expect(streak).toBe(1);
  });
});

