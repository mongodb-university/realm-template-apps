import { Document, ObjectId } from "bson";

export interface Todo extends Document {
  _id: ObjectId;
  owner_id: string;
  summary: string;
  isComplete: boolean;
}
