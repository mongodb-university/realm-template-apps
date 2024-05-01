import { Response, Request } from "express";
import {
  connectToEdgeServer,
  disconnectFromEdgeServer,
} from "../../db/mongoUtils";

import { EdgeConnectionStatus, User } from "../../types/types.js";

let connectionResult: EdgeConnectionStatus;

const login = async (request: Request, response: Response): Promise<void> => {
  if (request.body.email) {
    // Connect to Edge Server with email/password auth
    try {
      const rawUser = request.body as User;
      const user: User = {
        email: encodeURIComponent(rawUser.email),
        password: rawUser.password,
      };

      connectionResult = await connectToEdgeServer(user);

      response.status(200).json(connectionResult);
    } catch (error) {
      response.status(502).json(connectionResult!);
    }

    return;
  } else {
    // Bypass auth and connect to Edge Server
    try {
      connectionResult = await connectToEdgeServer();

      response.status(200).json(connectionResult);
    } catch (error) {
      response.status(502).json(connectionResult!);
    }
  }
};

const logout = async (request: Request, response: Response) => {
  try {
    connectionResult = await disconnectFromEdgeServer();

    response.status(200).json(connectionResult);
  } catch (error) {
    if (error instanceof Error) {
      response.status(502).json(connectionResult!);
    }
  }
};

export { login, logout };
