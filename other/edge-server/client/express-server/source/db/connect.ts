import { Collection, MongoClient } from "mongodb";
import { Todo, User } from "../types/types";

let todos: Collection<Todo>;

const connectToEdgeServer = async (user?: User) => {
  console.log("Connecting to Edge Server...");
  // If User object is passed connect to Edge Server with email/password auth.
  // Otherwise, bypass auth.
  const connectionString = user
    ? `mongodb://${user.email}:${user.password}@localhost:27021?authMechanism=PLAIN&appName=::local-userpass`
    : process.env.EDGE_SERVER_URI;

  const client = new MongoClient(connectionString!);
  const database = client.db("todo");
  todos = database.collection<Todo>("Item");

  try {
    await client.connect();
    console.log(`Connected to Atlas Edge Server at: ${connectionString}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Could not connect to Edge Server. Are you sure your Edge Server is running?`
      );
      throw new Error(error.message);
    }
  }
};

const getTodoCollection = () => {
  return todos;
};

export { connectToEdgeServer, getTodoCollection };
