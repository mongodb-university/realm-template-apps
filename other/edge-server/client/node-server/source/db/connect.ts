import { MongoClient } from "mongodb";
import { Todo } from "../types/types";

// Set EDGE_SERVER_URI in your own .env file.
const uri = process.env.EDGE_SERVER_URI;

const client = new MongoClient(uri!);
const database = client.db("todo");
const todos = database.collection<Todo>("Item");

const connectToEdgeServer = async () => {
  try {
    await client.connect();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  console.log(`Connected to Atlas Edge Server at: ${uri}`);
};

const getTodoCollection = () => {
  return todos;
};

export { connectToEdgeServer, getTodoCollection };
