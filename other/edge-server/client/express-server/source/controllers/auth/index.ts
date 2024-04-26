import { Response, Request } from "express";
import { connectToEdgeServer } from "../../db/connect";

import { User } from "../../types/types.js";

const login = async (request: Request, response: Response): Promise<void> => {
  if (request.body) {
    // Connect to Edge Server with email/password auth
    try {
      const rawUser = request.body as User;
      const user: User = {
        email: encodeURIComponent(rawUser.email),
        password: rawUser.password,
      };

      await connectToEdgeServer(user);

      response.status(200).json({
        message: `Logged into Edge Server with email`,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }

    return;
  } else {
    // Connect to Edge Server and bypass auth
    try {
      await connectToEdgeServer();

      response.status(200).json({
        message: `Logged into Edge Server. Bypassed authentication.`,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
};

export { login };
