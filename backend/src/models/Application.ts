import { Schema, model, Document, Types } from "mongoose";

export interface IApplication extends Document {
  title: string;
  type?: string;
  status: string;
  deadline?: Date;
  notes?: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
  title: { type: String, required: true },
  type: String,
  status: { type: String, default: "Not Started" },
  deadline: Date,
  notes: String,
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const Application = model<IApplication>("Application", applicationSchema);
