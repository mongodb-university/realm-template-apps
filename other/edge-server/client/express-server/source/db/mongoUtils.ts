import { Collection, Db, MongoClient } from "mongodb";
import { EdgeConnectionStatus, Todo, User } from "../types/types";

let client: MongoClient;
let database: Db;
let todos: Collection<Todo>;

const connectToEdgeServer = async (
  user?: User
): Promise<EdgeConnectionStatus> => {
  console.log("Connecting to Edge Server...");

  const edgeConnectionStatus: EdgeConnectionStatus = {
    message: "",
    connectionString: "",
    status: "",
  };

  // If User object is passed connect to Edge Server with email/password auth.
  // Otherwise, bypass auth.
  const connectionString = user
    ? `mongodb://${user.email}:${user.password}@localhost:27021?authMechanism=PLAIN&appName=::local-userpass`
    : process.env.EDGE_SERVER_URI!;

  client = new MongoClient(connectionString!);
  database = client.db("todo");
  todos = database.collection<Todo>("Item");

  try {
    await client.connect();

    // Set status object for response to client
    edgeConnectionStatus.message = "Logged into Atlas Edge Server";
    edgeConnectionStatus.connectionString = connectionString;
    edgeConnectionStatus.status = "connected";

    // Log for express server
    console.log(`Connected to Atlas Edge Server at: ${connectionString}`);
  } catch (error) {
    if (error instanceof Error) {
      // Set status object for response to client
      edgeConnectionStatus.message = "Could not connect to Atlas Edge Server";
      edgeConnectionStatus.connectionString = connectionString;
      edgeConnectionStatus.status = "disconnected";

      // Log for express server
      console.error(
        `Could not connect to Atlas Edge Server at: ${connectionString}`
      );
    }
  }

  return edgeConnectionStatus;
};

const disconnectFromEdgeServer = async (): Promise<EdgeConnectionStatus> => {
  await client.close();
  console.log("Disconnected from Atlas Edge Server");

  return {
    message: "Disconnected from Atlas Edge Server",
    connectionString: "",
    status: "disconnected",
  };
};

const getTodoCollection = () => {
  return todos;
};

export { connectToEdgeServer, disconnectFromEdgeServer, getTodoCollection };
