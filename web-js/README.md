# MongoDB Realm Web Starter

This project contains the web client for the MongoDB Realm template application. The client allows you to:
- Sign up and log in as an Email/Password user
- Create, check off, and delete to-do items

The client allows you to connect over Realm's [GraphQL API](https://docs.mongodb.com/realm/graphql/) or using [remote MongoDB queries](https://docs.mongodb.com/realm/web/mongodb/).

> ⚛️ **Create React App**
> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How To Build & Run the App

### 1. Download & Install Dependencies

You can download the app from the Realm UI, with Realm CLI, or by cloning this repository:

```shell
gh repo clone mongodb-university/realm-template-apps
cd realm-template-apps/web-js
npm install
```

### 2. Define `.env` Values

Open the `.env` file and define the following values:

- `REACT_APP_API_TYPE`: `"graphql"` or `"mql"`
- `REACT_APP_REALM_APP_ID`: Your template [App ID](https://docs.mongodb.com/realm/get-started/find-your-project-or-app-id/)

```shell
REACT_APP_API_TYPE="graphql"
# REACT_APP_API_TYPE="mql"
REACT_APP_REALM_APP_ID="todo-sync-tmikv"
```

> 💡 **Restart to Change Environment Values**
> The app only sources `.env` values once. If you change a value while the app is running, the app continues to use the value that was defined when it started.

### 3. Run the App

```
npm run start
```
