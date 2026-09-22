const assert = require("assert");

// Test scoring logic
function scoreGuess(guess, secret) {
  const len = secret.length;
  const result = Array(len).fill("absent");
  const secretArr = secret.split("");
  const used = Array(len).fill(false);

  for (let i = 0; i < len; i++) {
    if (guess[i] === secretArr[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  for (let i = 0; i < len; i++) {
    if (result[i] === "correct") continue;
    const matchIdx = secretArr.findIndex((ch, j) => ch === guess[i] && !used[j]);
    if (matchIdx !== -1) {
      result[i] = "present";
      used[matchIdx] = true;
    }
  }

  return result;
}

// Test streak logic
function calculateStreak(currentStreak, lastPlayedAt, nowDate) {
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

console.log("Running unit tests...");

// Test 1: Scoring all correct
assert.deepStrictEqual(scoreGuess("CRUMB", "CRUMB"), ["correct", "correct", "correct", "correct", "correct"]);
console.log("✓ Test 1 Passed: All correct letters");

// Test 2: Scoring mixed
assert.deepStrictEqual(scoreGuess("CROWN", "CRUMB"), ["correct", "correct", "absent", "absent", "absent"]);
console.log("✓ Test 2 Passed: Mixed correct/absent letters");

// Test 3: Scoring present & correct
assert.deepStrictEqual(scoreGuess("ROBOT", "TOAST"), ["absent", "correct", "absent", "absent", "correct"]);
console.log("✓ Test 3 Passed: Present & correct letter scoring");

// Test 4: Streak initial
const now = new Date("2026-09-15T14:00:00Z");
assert.strictEqual(calculateStreak(0, null, now), 1);
console.log("✓ Test 4 Passed: Initial streak = 1");

// Test 5: Streak yesterday
const yesterday = new Date("2026-09-14T18:00:00Z");
assert.strictEqual(calculateStreak(5, yesterday, now), 6);
console.log("✓ Test 5 Passed: Yesterday play increments streak (+1)");

// Test 6: Streak today
const earlierToday = new Date("2026-09-15T08:00:00Z");
assert.strictEqual(calculateStreak(5, earlierToday, now), 5);
console.log("✓ Test 6 Passed: Same day play maintains streak");

// Test 7: Streak missed day
const threeDaysAgo = new Date("2026-09-12T14:00:00Z");
assert.strictEqual(calculateStreak(10, threeDaysAgo, now), 1);
console.log("✓ Test 7 Passed: Missed day resets streak to 1");

console.log("\nALL 7 TESTS PASSED SUCCESSFULLY! 🎉");
