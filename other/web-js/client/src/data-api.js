import { ClientApi } from "./client-api";

export class DataApi {
  static constructBaseUrl(appId, location) {
    const { deployment_model, cloud, region } = location;
    if (deployment_model === "LOCAL") {
      return `https://${region}.${cloud}.data.mongodb-api.com/app/${appId}/endpoint/data/v1/`;
    } else {
      return `https://data.mongodb-api.com/app/${appId}/endpoint/data/v1/`;
    }
  }

  constructor(config) {
    const { appId, cloud, region, onAuthChange } = config;
    this.appId = appId;
    this.baseUrl = DataApi.constructBaseUrl(appId, { cloud, region });
    this.client = new ClientApi({
      appId,
      cloud,
      region,
      onAuthChange: (newCurrentUser) => {
        this.currentUser = newCurrentUser;
        onAuthChange?.(this.currentUser);
      },
    });
    this.currentUser = this.client.currentUser;
  }

  registerUser = async (provider, credentials) => {
    await this.client.registerUser(provider, credentials);
  };

  logIn = async (provider, credentials) => {
    console.log("[D] logIn", provider, credentials);
    await this.client.logIn(provider, credentials);
  };

  logOut = async () => {
    await this.client.logOut();
  };

  emailPasswordAuth = {
    registerUser: async ({ email, password }) => {
      return await this.registerUser("local-userpass", { email, password });
    },

    logIn: async ({ email, password }) => {
      return await this.logIn("local-userpass", { email, password });
    }
  };

  // type FindOneInput = {
  //   dataSource: string;
  //   database: string;
  //   collection: string;
  //   filter?: object;
  //   projection?: object;
  // }
  // type FindOneResult = {
  //   document: object;
  // }
  // findOne(input: FindOneInput): Promise<FindOneResult>;

  findOne = async (input) => {
    return this.action("findOne", input);
  };

  // type FindInput = {
  //   dataSource: string;
  //   database: string;
  //   collection: string;
  //   filter?: object;
  //   projection?: object;
  //   sort?: object;
  //   skip?: number;
  //   limit?: number;
  // }
  // type FindResult = {
  //   documents: object[];
  // }
  // find(input: FindInput): Promise<FindResult>;

  find = async (input) => {
    return this.action("find", input);
  };

  // type InsertOneInput = {
  //   dataSource: string;
  //   database: string;
  //   collection: string;
  //   document: object;
  // };
  // type InsertOneResult = {
  //   insertedId: string;
  // }
  //
  // insertOne(input: InsertOneInput): Promise<InsertOneResult>;
  insertOne = async (input) => {
    return this.action("insertOne", input);
  };

  // type InsertManyInput = {
  //   dataSource: string;
  //   database: string;
  //   collection: string;
  //   documents: object[];
  // };
  // type InsertManyResult = {
  //   insertedIds: string[];
  // }

  // insertMany(input: InsertManyInput): Promise<InsertManyResult>;
  insertMany = async (input) => {
    return this.action("insertMany", input);
  };

  // type UpdateInput = {
  //   dataSource: string;
  //   database: string;
  //   collection: string;
  //   filter: object;
  //   update: object;
  //   upsert?: boolean;
  // }
  // type UpdateResult = {
  //   matchedCount: number;
  //   modifiedCount: number;
  //   upsertedId?: string;
  // }

  // updateOne(input: UpdateInput): Promise<UpdateResult>;
  updateOne = async (input) => {
    return this.action("updateOne", input);
  };

  // updateMany(input: UpdateInput): Promise<UpdateResult>;
  updateMany = async (input) => {
    return this.action("updateMany", input);
  };

  // type ReplaceOneInput = {
  //   dataSource: string;
  //   database: string;
  //   collection: string;
  //   filter: object;
  //   replacement: object;
  //   upsert?: boolean;
  // }
  // type ReplaceOneResult = {
  //   matchedCount: number;
  //   modifiedCount: number;
  //   upsertedId?: string;
  // }

  // replaceOne(input: ReplaceOneInput): Promise<ReplaceOneResult>;
  replaceOne = async (input) => {
    return this.action("replaceOne", input);
  };

  // type DeleteInput = {
  //   dataSource: string;
  //   database: string;
  //   collection: string;
  //   filter: object;
  // }
  // type DeleteResult = {
  //   deletedCount: number;
  // }

  // deleteOne(input: DeleteInput): Promise<DeleteResult>;
  deleteOne = async (input) => {
    return this.action("deleteOne", input);
  };
  // deleteMany(input: DeleteInput): Promise<DeleteResult>;
  deleteMany = async (input) => {
    return this.action("deleteMany", input);
  };

  // action(action: string, input: object): Promise<Response>;
  async action(action, input) {
    if (!this.currentUser) {
      throw new Error(`Must be logged in to call a Data API action endpoint`);
    }
    // If the current user access token is expired, try to refresh the
    // session and get a new access token.
    await this.client.refreshExpiredAccessToken();

    const url = new URL(`action/${action}`, this.baseUrl).href;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/ejson",
        Accept: "application/ejson",
        Authorization: `Bearer ${this.currentUser.access_token}`,
      },
      body: JSON.stringify(input),
    });
    const response = await resp.json();

    if (resp.status === 200 || resp.status === 201) {
      return response;
    } else {
      throw new Error(response);
    }
  }
}
