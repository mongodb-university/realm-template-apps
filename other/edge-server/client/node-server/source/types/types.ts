import { Document, ObjectId } from "bson";

export interface Todo extends Document {
  _id: ObjectId;
  summary: string;
  isComplete: boolean;
}
