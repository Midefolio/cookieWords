import { Schema, model, models, Document } from "mongoose";

export interface ISeenWord extends Document {
  walletAddress: string;
  word: string;
  seenAt: Date;
}

const SeenWordSchema = new Schema<ISeenWord>({
  walletAddress: { type: String, required: true, index: true },
  word: { type: String, required: true },
  seenAt: { type: Date, default: Date.now },
});

SeenWordSchema.index({ walletAddress: 1, word: 1 }, { unique: true });

export const SeenWord = models.SeenWord || model<ISeenWord>("SeenWord", SeenWordSchema);

