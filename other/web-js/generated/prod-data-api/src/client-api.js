import jwtDecode from "jwt-decode";
import atlasConfig from "./atlasConfig.json";

/**
 * Connect to the MongoDB Atlas App Services Client API for your App.
 */
export class ClientApi {
  /**
   * Create a new Client API client.
   * @param {object} config The configuration for the Client API client.
   * @param {string} config.appId The Client App ID of the App Services App to connect to, e.g. `myapp-abcde`.
   * @param {function} [config.onAuthChange] A callback that's run with the latest auth state whenever the current user changes.
   * @example
   * const clientApi = new ClientApi({
   *   appId: "myapp-abcde",
   *   onAuthChange: (currentUser) => {
   *     console.log("The current user is now:", currentUser.id);
   *   }
   * });
   */
  constructor({ appId, onAuthChange }) {
    this.appId = appId;
    this.credentialStorage = new CredentialStorage(appId);
    this.currentUser = this.credentialStorage.get("currentUser");
    this.baseUrl = atlasConfig.clientApiBaseUrl;
    this.onAuthChange = onAuthChange;
  }

  /**
   * Construct a Client API URL at the given path
   * @param {string} path The path to the Client API endpoint, e.g. `/auth/providers/local-userpass/login`.
   * @returns {string} The full URL of the Client API endpoint.
   */
  #endpointUrl = (path) => {
    if (!path.startsWith("/")) {
      throw new Error(`Client API path must start with a slash ("/")`);
    }
    const url = new URL(
      `/api/client/v2.0/app/${this.appId}` + path,
      this.baseUrl
    );
    return url.href;
  };

  /**
   * @typedef {object} User User account information, session tokens, and other metadata.
   * @property {string} user_id The user's account ID.
   * @property {string} access_token The access token for the user.
   * @property {string} refresh_token The refresh token for the user.
   * @property {string} [device_id] The ID of the device that the user is logged in on.
   */

  /**
   * Set the current user.
   * @param {User | null} user The user to set as the current user, or null to unauthenticate the client.
   * @example
   * this.#setCurrentUser({
   *   "user_id": "63f504a25dde21e6f10ba025"
   *   "access_token": "eyJhbGciOiJIUzI1NiIsI...TYNZYyCM3RKl77FuW_kBf29POr24"
   *   "device_id": "63f504a75dd881f2f58ba09a",
   *   "refresh_token": "eyJhbGciOiJIUzI1BiIsI...ynIqiC0bxVAdvYJmw3L1358T3UJk",
   * })
   */
  #setCurrentUser = (user) => {
    this.currentUser = user;
    this.credentialStorage.set("currentUser", this.currentUser);
    this.onAuthChange?.(this.currentUser);
  };

  /**
   * Register a new user with the specified authentication provider.
   * @param {string} provider The name of the authentication provider to use.
   * @param {object} credentials Information used to authenticate with the specified provider.
   * @returns {Promise<void>}
   * @example
   * await clientApi.registerUser("local-userpass", {
   *   email: "someone@example.com",
   *   password: "mypassw0rd!",
   * });
   */
  registerUser = async (provider, credentials) => {
    const url = this.#endpointUrl(`/auth/providers/${provider}/register`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (response.status === 201) {
      // Status 201 means the user was created. There is no response body.
      return;
    } else {
      throw new ClientApiError(await response.json());
    }
  };

  /**
   * Log a user in with the specified authentication provider.
   * @param {string} provider The name of the authentication provider to use.
   * @param {object} credentials Information used to authenticate with the specified provider.
   * @returns {Promise<void>}
   * @example
   * await clientApi.logIn("local-userpass", {
   *   email: "someone@example.com",
   *   password: "mypassw0rd!",
   * });
   * @example
   * await clientApi.logIn("api-key", {
   *   key: "BB4Y996banzQDlEuldiBfdVi1cDsxT1uoGUFJObDEsUiFdSlIVISXzIMzpZZpJsw"
   * });
   */
  logIn = async (provider, credentials) => {
    const url = this.#endpointUrl(`/auth/providers/${provider}/login`);
    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (response.status === 200) {
      const data = await response.json();
      this.#setCurrentUser({
        id: data.user_id,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      return this.currentUser;
    } else {
      throw new ClientApiError(await response.json());
    }
  };

  /**
   * Log the current user out.
   * @returns {void}
   * @example
   * clientApi.logOut();
   */
  logOut = () => {
    this.#setCurrentUser(null);
  };

  /**
   * Refresh the access token for the current user if it has expired.
   * @returns {Promise<User>}
   * @throws {Error} If the client is not authenticated.
   */
  refreshExpiredAccessToken = async () => {
    if (!this.currentUser) {
      throw new Error(
        "Must be authenticated to call refreshExpiredAccessToken()"
      );
    }
    const { access_token, refresh_token } = this.currentUser;
    const { exp } = jwtDecode(access_token);
    const now = new Date().getTime() / 1000;
    const hasExpiredAccessToken = now >= exp;
    if (hasExpiredAccessToken) {
      // If the access token has expired then we need to refresh it.
      const refreshed = await this.refreshSession({ refresh_token });
      this.#setCurrentUser({
        ...this.currentUser,
        access_token: refreshed.access_token,
      });
    }
    return this.currentUser;
  };


  /**
   * Get a new access token with a refresh token.
   * @param {object} input
   * @param {string} input.refresh_token - The refresh token for the access token to refresh.
   * @returns {Promise<{ access_token: User["access_token"] }>}
   */
  refreshSession = async ({ refresh_token }) => {
    const url = this.#endpointUrl(`/auth/session`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refresh_token}}`,
      },
    });
    if (response.status === 200) {
      return await response.json();
    } else {
      throw new ClientApiError(await response.json());
    }
  };

  /**
   * An email/password authentication wrapper around the generic auth
   * methods.
   */
  emailPasswordAuth = {
    /**
     * Register a new user with the email/password authentication provider.
     * @param {object} credentials - The email and password to register with.
     * @param {string} credentials.email - The email address to register with.
     * @param {string} credentials.password - The password to register with.
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
     * @param {object} credentials - The email and password to log in with.
     * @param {string} credentials.email - The email address to log in with.
     * @param {string} credentials.password - The password to log in with.
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
}

/**
 * CredentialStorage is a lightweight wrapper around localStorage that
 * lets users stay logged in across page refreshes. You could replace
 * this with your own implementation if you wanted to use a different
 * storage mechanism.
 */
export class CredentialStorage {
  /**
   * @param {string} id - A namespace for the stored keys. You probably want to use your App's Client App ID for this.
   * @example
   * const storage = new CredentialStorage("my-app-abcde");
   */
  constructor(id) {
    this.namespace = `@${id}`;
  }
  namespacedKey(key) {
    return `${this.namespace}/${key}`;
  }
  get(key) {
    const data = localStorage.getItem(this.namespacedKey(key));
    return JSON.parse(data);
  }
  set(key, data) {
    localStorage.setItem(this.namespacedKey(key), JSON.stringify(data));
  }
  delete(key) {
    localStorage.removeItem(this.namespacedKey(key));
  }
  clearAll() {
    localStorage.clear();
  }
}

/**
 * A wrapper around JavaScript's built-in Error object that represents
 * errors returned by the Client API.
 * @example
 * {
 *   error: 'name already in use',
 *   error_code: 'AccountNameInUse',
 *   link: 'https://realm.mongodb.com/groups/{groupId}/apps/{appId}/logs?co_id=63f506d9d243efe65aa33430'
 * }
 */
export class ClientApiError extends Error {
  /**
   * @param {object} input
   * @param {string} input.error - A human-readable error message.
   * @param {string} input.error_code - A machine-readable error code.
   * @param {string} input.link - A link to a related application log in the App Services UI.
   */
  constructor({ error, error_code, link }) {
    super(error);
    this.name = "ClientApiError";
    this.error = error;
    this.error_code = error_code;
    this.link = link;
  }
}
