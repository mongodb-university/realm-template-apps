import "dotenv/config.js";
import express, { Express } from "express";
import cors from "cors";

import todoRoutes from "./routes/index.js";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(todoRoutes);

const port = process.env.PORT || 5055;
app.listen(port, async () => {
  console.log(`Express server is running on port: ${port}`);
});
