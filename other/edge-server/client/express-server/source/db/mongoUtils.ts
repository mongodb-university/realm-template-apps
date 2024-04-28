import { Collection, MongoClient } from "mongodb";
import { EdgeConnectionStatus, Todo, User } from "../types/types";

let client: MongoClient;
let todos: Collection<Todo>;

const connectToEdgeServer = async (
  user?: User
): Promise<EdgeConnectionStatus> => {
  console.log("Connecting to Edge Server...");

  let message = "";
  // If User object is passed connect to Edge Server with email/password auth.
  // Otherwise, bypass auth.
  const connectionString = user
    ? `mongodb://${user.email}:${user.password}@localhost:27021?authMechanism=PLAIN&appName=::local-userpass`
    : process.env.EDGE_SERVER_URI!;

  client = new MongoClient(connectionString!);
  const database = client.db("todo");
  todos = database.collection<Todo>("Item");

  try {
    await client.connect();
    message = "Logged into Atlas Edge Server with email";

    console.log(`Connected to Atlas Edge Server at: ${connectionString}`);
  } catch (error) {
    if (error instanceof Error) {
      message = "Logged into Atlas Edge Server. Bypassed authentication.";
      console.error(
        `Could not connect to Atlas Edge Server at: ${connectionString}`
      );

      throw new Error(error.message);
    }
  }

  return {
    message,
    connectionString,
  };
};

const disconnectFromEdgeServer = async (): Promise<EdgeConnectionStatus> => {
  await client.close();
  console.log("Disconnected from Atlas Edge Server");

  return {
    message: "Disconnected from Atlas Edge Server",
    connectionString: "",
  };
};

const getTodoCollection = () => {
  return todos;
};

// const getClient = async () => {
//   return client;
// };

export {
  connectToEdgeServer,
  disconnectFromEdgeServer,
  // getClient,
  getTodoCollection,
};
