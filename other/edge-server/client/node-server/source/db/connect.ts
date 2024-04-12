import { MongoClient } from "mongodb";
import { Todo } from "../types/types";

// Set EDGE_SERVER_URI in your own .env file.
const uri = process.env.EDGE_SERVER_URI;

const client = new MongoClient(uri!);
const database = client.db("todo");
const todos = database.collection<Todo>("Item");

const connectToEdgeServer = async (port: string | number) => {
  try {
    await client.connect();
    console.log(`Connected to Atlas Edge Server at: ${uri}`);
    console.log(`Express server is running on port: ${port}`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        `Could not connect to Edge Server. Are you sure your Edge Server is running?`
      );
      throw error.message;
    }
  }
};

const getTodoCollection = () => {
  return todos;
};

export { connectToEdgeServer, getTodoCollection };
