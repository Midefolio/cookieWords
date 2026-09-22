import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connect";
import { SeenWord } from "@/models/SeenWord";
import { getSessionWalletAddress } from "@/lib/session";
import { WORD_LIST, getHintForWord } from "@/lib/words/dictionary";

export async function GET(req: NextRequest) {
  try {
    const modeParam = req.nextUrl.searchParams.get("mode") || "easy";
    const mode = modeParam === "medium" || modeParam === "hard" ? modeParam : "easy";
    const walletAddress = await getSessionWalletAddress();
    if (!walletAddress) {
      return NextResponse.json({ error: "Unauthorized - wallet session required" }, { status: 401 });
    }

    await dbConnect();

    const seenDocs = await SeenWord.find({ walletAddress }).select("word");
    const seenSet = new Set(seenDocs.map((d) => d.word.toUpperCase()));

    const easyWords = new Set(["CRUMB", "BAKER", "DOUGH", "SUGAR", "TOAST", "FLOUR", "SWEET", "OVEN", "TREAT", "SNACK", "APPLE", "HONEY", "CREAM", "FROST", "CANDY"]);
    const hardWords = new Set(["AFFIX", "FJORD", "GLYPH", "JOUST", "KUDZU", "NYMPH", "QUERN", "VIXEN", "WALTZ", "ZESTY", "OXIDE", "VERVE"]);
    const modeWords = mode === "easy"
      ? WORD_LIST.filter((word) => easyWords.has(word))
      : mode === "hard"
        ? WORD_LIST.filter((word) => hardWords.has(word))
        : WORD_LIST;
    let unseenWords = modeWords.filter((w) => !seenSet.has(w.toUpperCase()));

    if (unseenWords.length === 0) {
      // Player has seen all words! Wrap around and reset seen list
      await SeenWord.deleteMany({ walletAddress });
      unseenWords = modeWords;
    }

    const randomIndex = Math.floor(Math.random() * unseenWords.length);
    const chosenWord = unseenWords[randomIndex];
    const hint = getHintForWord(chosenWord);

    return NextResponse.json({
      word: chosenWord,
      hint,
    });
  } catch (error: any) {
    console.error("new-word error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch word" }, { status: 500 });
  }
}
