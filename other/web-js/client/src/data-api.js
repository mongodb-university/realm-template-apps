import { ClientApi } from "./client-api";
import atlasConfig from "./atlasConfig.json";

/**
 * Connect to the MongoDB Atlas App Services Data API for your App.
 */
export class DataApi {
  /**
   * Create a new Data API client.
   * @param {object} config - The configuration for the Data API client.
   * @param {string} config.appId - The Client App ID of the App Services App to connect to, e.g. `myapp-abcde`.
   * @param {function} [config.onAuthChange] - A callback that's run with the latest auth state whenever the current user changes.
   * @example
   * const dataApi = new DataApi({
   *   appId: "myapp-abcde",
   *   onAuthChange: (currentUser) => {
   *     console.log("The current user is now:", currentUser.id);
   *   }
   * });
   */
  constructor({ appId, onAuthChange }) {
    this.appId = appId;
    this.baseUrl = atlasConfig.dataApiBaseUrl;
    this.client = new ClientApi({
      appId,
      onAuthChange: (newCurrentUser) => {
        this.currentUser = newCurrentUser;
        onAuthChange?.(this.currentUser);
      },
    });
    this.currentUser = this.client.currentUser;
  }

  /**
   * Register a new user with the specified authentication provider.
   * @param {string} provider - The name of the authentication provider to use.
   * @param {object} credentials - Information used to authenticate with the specified provider.
   * @returns {Promise<void>}
   */
  registerUser = async (provider, credentials) => {
    await this.client.registerUser(provider, credentials);
  };

  /**
   * Log a user in with the specified authentication provider.
   * @param {string} provider - The name of the authentication provider to use.
   * @param {object} credentials - Information used to authenticate with the specified provider.
   * @returns {Promise<void>}
   * @example
   * await dataApi.logIn("local-userpass", {
   *   email: "someone@example.com",
   *   password: "mypassw0rd!",
   * });
   * @example
   * await dataApi.logIn("api-key", {
   *   key: "BB4Y996banzQDlEuldiBfdVi1cDsxT1uoGUFJObDEsUiFdSlIVISXzIMzpZZpJsw"
   * });
   */
  logIn = async (provider, credentials) => {
    await this.client.logIn(provider, credentials);
  };

  /**
   * Log the current user out.
   * @returns {Promise<void>}
   * @example
   * await dataApi.logOut();
   */
  logOut = async () => {
    await this.client.logOut();
  };

  /**
   * An email/password authentication wrapper around the generic auth
   * methods.
   */
  emailPasswordAuth = {
    /**
     * Register a new user with the email/password authentication provider.
     * @param {object} - credentials The email and password to register with.
     * @param {string} - credentials.email The email address to register with.
     * @param {string} - credentials.password The password to register with.
     * @returns {Promise<void>}
     * @example
     * await dataApi.emailPasswordAuth.registerUser({
     *  email: "someone@example.com",
     *  password: "mypassw0rd!",
     * });
     */
    registerUser: async ({ email, password }) => {
      return await this.registerUser("local-userpass", { email, password });
    },

    /**
     * Log a user in with the email/password authentication provider.
     * @param {object} - credentials The email and password to log in with.
     * @param {string} - credentials.email The email address to log in with.
     * @param {string} - credentials.password The password to log in with.
     * @returns {Promise<void>}
     * @example
     * await dataApi.emailPasswordAuth.logIn({
     *  email: "someone@example.com",
     *  password: "mypassw0rd!",
     * });
     */
    logIn: async ({ email, password }) => {
      return await this.logIn("local-userpass", { email, password });
    },
  };

  /**
   * Call a specified Data API action endpoint.
   * @param {string} action - The name of a Data API action to perform, e.g. "insertOne"
   * @param {object} input - The request body for the action.
   * @returns {object} - The response body for the action.
   */
  async action(action, input) {
    if (!this.currentUser) {
      throw new Error(`Must be logged in to call a Data API action endpoint`);
    }
    // If the current user access token is expired, try to refresh the
    // session and get a new access token.
    await this.client.refreshExpiredAccessToken();
    const url = new URL(
      `/app/${this.appId}/endpoint/data/v1/action/${action}`,
      this.baseUrl
    ).href;
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

  /**
   * @typedef {Object} FindOneInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object} [filter] - A MongoDB query filter to match documents.
   * @property {object} [projection] - A MongoDB projection to control which fields are returned.
   *
   * @typedef {Object} FindOneResult
   * @property {object | null} document - The document that was found, or null if no document matched the filter.
   */

  /**
   * Find a single document in a collection.
   * @param {FindOneInput} input - The request body for the action.
   * @returns {Promise<FindOneResult>} - The response body for the action.
   *
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-findOne
   */
  findOne = async (input) => {
    return this.action("findOne", input);
  };

  /**
   * @typedef {Object} FindInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object} [filter] - A MongoDB query filter to match documents.
   * @property {object} [projection] - A MongoDB projection to control which fields are returned.
   * @property {object} [sort] - A MongoDB sort specification to control the order of the results.
   * @property {number} [skip] - The number of documents to skip before returning results.
   * @property {number} [limit] - The maximum number of documents to return.
   *
   * @typedef {Object} FindResult
   * @property {object[]} documents - The documents that matched the filter.
   */

  /**
   * Find documents in a collection.
   * @param {FindInput} input - The request body for the action.
   * @returns {Promise<FindResult>} - The response body for the action.
   *
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-find
   */
  find = async (input) => {
    return this.action("find", input);
  };

  /**
   * @typedef {Object} InsertOneInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object} document - The document to insert.
   *
   * @typedef {Object} InsertOneResult
   * @property {string} insertedId - The _id of the inserted document.
   */

  /**
   * Insert a single document into a collection.
   * @param {InsertOneInput} input - The request body for the action.
   * @returns {Promise<InsertOneResult>} - The response body for the action.
   *
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-insertOne
   */
  insertOne = async (input) => {
    return this.action("insertOne", input);
  };

  /**
   * @typedef {Object} InsertManyInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object[]} documents - The documents to insert.
   *
   * @typedef {Object} InsertManyResult
   * @property {string[]} insertedIds - The _ids of the inserted documents.
   */

  /**
   * Insert multiple documents into a collection.
   * @param {InsertManyInput} input - The request body for the action.
   * @returns {Promise<InsertManyResult>} - The response body for the action.
   *
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-insertMany
   */
  insertMany = async (input) => {
    return this.action("insertMany", input);
  };

  /**
   * @typedef {Object} UpdateInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object} filter - A MongoDB query filter to match documents.
   * @property {object} update - A MongoDB update specification to apply to the matched documents.
   * @property {boolean} [upsert] - Whether to insert a new document if no documents match the filter.
   *
   * @typedef {Object} UpdateResult
   * @property {number} matchedCount - The number of documents that matched the filter.
   * @property {number} modifiedCount - The number of documents that were modified.
   * @property {string} [upsertedId] - The _id of the upserted document, if any.
   */

  /**
   * Update a single document in a collection.
   * @param {UpdateInput} input - The request body for the action.
   * @returns {Promise<UpdateResult>} - The response body for the action.
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-updateOne
   */
  updateOne = async (input) => {
    return this.action("updateOne", input);
  };

  /**
   * Update multiple documents in a collection.
   * @param {UpdateInput} input - The request body for the action.
   * @returns {Promise<UpdateResult>} - The response body for the action.
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-updateMany
   */
  updateMany = async (input) => {
    return this.action("updateMany", input);
  };

  /**
   * @typedef {Object} ReplaceOneInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object} filter - A MongoDB query filter to match documents.
   * @property {object} replacement - The document to replace the matched document with.
   * @property {boolean} [upsert] - Whether to insert a new document if no documents match the filter.
   */

  /**
   * Replace a single document in a collection.
   * @param {ReplaceOneInput} input - The request body for the action.
   * @returns {Promise<UpdateResult>} - The response body for the action.
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-replaceOne
   */
  replaceOne = async (input) => {
    return this.action("replaceOne", input);
  };

  /**
   * @typedef {Object} DeleteInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object} filter - A MongoDB query filter to match documents.
   *
   * @typedef {Object} DeleteResult
   * @property {number} deletedCount - The number of documents that were deleted.
   */

  /**
   * Delete a single document from a collection.
   * @param {DeleteInput} input - The request body for the action.
   * @returns {Promise<DeleteResult>} - The response body for the action.
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-deleteOne
   */
  deleteOne = async (input) => {
    return this.action("deleteOne", input);
  };

  /**
   * Delete multiple documents from a collection.
   * @param {DeleteInput} input - The request body for the action.
   * @returns {Promise<DeleteResult>} - The response body for the action.
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-deleteMany
   */
  deleteMany = async (input) => {
    return this.action("deleteMany", input);
  };


  /**
   * @typedef {Object} AggregateInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object[]} pipeline - An array of aggregation pipeline stages.
   *
   * @typedef {Object} AggregateResult
   * @property {object[]} documents - The documents returned by the aggregation pipeline.
   */

  /**
   * Run an aggregation pipeline against a collection.
   * @param {AggregateInput} input - The request body for the action.
   * @returns {Promise<AggregateResult>} - The response body for the action.
   * @see https://mongodb.com/docs/atlas/app-services/data-api/generated-endpoints/#std-label-data-api-aggregate
   */
  aggregate = async (input) => {
    return this.action("aggregate", input);
  };
}
