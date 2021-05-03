# MongoDB Realm Web Starter

This project contains the web client for the MongoDB Realm template application. The client allows you to:
- Sign up and log in as an Email/Password user
- Create, check off, and delete to-do items

The client allows you to connect over Realm's [GraphQL API](https://docs.mongodb.com/realm/graphql/) or using [remote MongoDB queries](https://docs.mongodb.com/realm/web/mongodb/).

> ⚛️ **Create React App**
> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Generate Artifact Projects

This project is used as a single source for multiple generated apps. We use
[Bluehawk](https://github.com/mongodb-university/Bluehawk/) to generate the apps based on special
comments in the code.

To generate all of the artifact projects, run the following:

```shell
npm run generate:prod
```

You can also generate a specific artifact project:

```shell
npm run generate:prod-graphql
```

```shell
npm run generate:prod-mql
```


> 🧰 **Tip: Install Dependencies to Run Artifact Projects**
> Bluehawk does not include `node_modules` when you generate an artifact project. If you want to run the generated code, you'll need to run `npm install` first.

## Build & Run the App in Development

### 1. Download & Install Dependencies

You can download the app from the Realm UI, with Realm CLI, or by cloning this repository:

```shell
gh repo clone mongodb-university/realm-template-apps
cd realm-template-apps/web-js
npm install
```

### 2. Define the API Type

This app is built to use a pluggable backend API that conforms to the useTodo() hook interface. You can either use a pure MQL implementation or use your app's GraphQL API. *Note that the artifact projects don't use a `.env` file - it's only for development!*

Open the `.env` file and specify either `"graphql"` or `"mql"` for `REACT_APP_API_TYPE`:

```shell
REACT_APP_API_TYPE="graphql"
# REACT_APP_API_TYPE="mql"
```

> 💡 **Restart to Change Environment Values**
> The app only sources `.env` values once. If you change a value while the app is running, the app continues to use the value that was defined when it started.

### 3. Specify Your Realm App ID

Specify your template App ID and URL in the `appId` and `url` fields of `realm.json`:

```json
{
  "appId": "<Your Template App ID>",
  "url": "<App Base URL>"
}
```

### 4. Run the App

```
npm run start
```
