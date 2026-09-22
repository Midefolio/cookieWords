import { Schema, model, models, Document } from "mongoose";

export interface IPlayer extends Document {
  walletAddress: string;
  crumbs: number;
  xp: number;
  streakDays: number;
  lastPlayedAt?: Date;
  totalWins: number;
  bestTimeSecs?: number;
  createdAt: Date;
}

const PlayerSchema = new Schema<IPlayer>({
  walletAddress: { type: String, required: true, unique: true, index: true },
  crumbs: { type: Number, default: 3 },
  xp: { type: Number, default: 150 },
  streakDays: { type: Number, default: 0 },
  lastPlayedAt: { type: Date },
  totalWins: { type: Number, default: 0 },
  bestTimeSecs: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export const Player = models.Player || model<IPlayer>("Player", PlayerSchema);

