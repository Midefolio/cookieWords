export type TileState = "empty" | "tapped" | "correct" | "present" | "absent";

export function scoreGuess(guess: string, secret: string): TileState[] {
  const len = secret.length;
  const result: TileState[] = Array(len).fill("absent");
  const secretArr = secret.split("");
  const used = Array(len).fill(false);

  // First pass: exact matches
  for (let i = 0; i < len; i++) {
    if (guess[i] === secretArr[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  // Second pass: present matches
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

