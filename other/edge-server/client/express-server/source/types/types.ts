import { Document, ObjectId } from "bson";

export interface Todo extends Document {
  _id: ObjectId;
  owner_id: string;
  summary: string;
  isComplete: boolean;
}

export interface User {
  email: string;
  password: string;
}

export interface EdgeConnectionStatus {
  message: string;
  connectionString: string;
  status: string;
}
