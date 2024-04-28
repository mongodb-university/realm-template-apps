import { Response, Request } from "express";
import {
  connectToEdgeServer,
  disconnectFromEdgeServer,
} from "../../db/mongoUtils";

import { EdgeConnectionStatus, User } from "../../types/types.js";

const login = async (request: Request, response: Response): Promise<void> => {
  if (request.body.email) {
    // Connect to Edge Server with email/password auth
    try {
      const rawUser = request.body as User;
      const user: User = {
        email: encodeURIComponent(rawUser.email),
        password: rawUser.password,
      };

      const connectionResult: EdgeConnectionStatus = await connectToEdgeServer(
        user
      );

      response.status(200).json(connectionResult);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }

    return;
  } else {
    // Bypass auth and connect to Edge Server
    try {
      const connectionResult: EdgeConnectionStatus =
        await connectToEdgeServer();

      response.status(200).json(connectionResult);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
};

const logout = async (request: Request, response: Response) => {
  try {
    const connectionResult: EdgeConnectionStatus =
      await disconnectFromEdgeServer();

    response.status(200).json(connectionResult);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export { login, logout };
