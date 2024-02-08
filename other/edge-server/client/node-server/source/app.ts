import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";

import { connectToEdgeServer } from "./db/connect.js";
import todoRoutes from "./routes/index.js";

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(todoRoutes);

app.listen(port, async () => {
  console.log("Connecting to Edge Server...");

  // Connect to Edge Server database when Express server starts.
  await connectToEdgeServer();

  console.log(`Express server is running on port: ${port}`);
});
