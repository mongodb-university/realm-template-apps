# Edge Server with MongoDB Node.js Driver

This example todo application demonstrates using Edge Server with a MongoDB Driver.
It uses the [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
in an Express server application to connect to Edge Server. It has a React
frontend for performing CRUD operations.

React client -> Express server (Node.js Driver) -> Edge Server -> Atlas

To use this example application, you must:

1. Create an App Services App based on the `edge-server.todo` template app, and
   get Edge Server enabled for your new app.
2. Download, configure, and start the Edge Server.
3. Install dependencies and start the Node.js Express server.
4. Install dependencies and start the React server.

This is a MERN stack that connects to the Edge Server instead of Atlas.
In this version of the example app, MongoDB wire protocol connections connect
directly to Edge Server without authorization.

For a MERN stack tutorial, refer to
[How to Use Mern Stack: A Complete Guide](https://www.mongodb.com/languages/mern-stack-tutorial).

For more information about Edge Server, refer to the
[Edge Server documentation](https://www.mongodb.com/docs/atlas/app-services/edge-server/).

Atlas Edge Server is currently in Private Preview. To learn more about
previewing Edge Server, refer to the product page at
[Edge Server](https://www.mongodb.com/products/platform/atlas-edge-server).

## Project npm commands

- `install-deps`: installs the dependencies for the Express server and
  React client. You must install the Edge Server dependencies separately.
- `start`: starts the Edge Server, Express server, and React client.
- `shut-down`: shuts down the Edge Server, Express server, and React client.

## Quick Start

1. Create an App Services App based on the `edge-server.todo` template app, and
   get Edge Server enabled for your new app.
2. Download and configure the Edge Server.
3. Start Docker
4. From the project's root directory, run `npm run install-deps`.
5. Add a `.env` file inside the `node-server` directory with the details
   required to run the Express Server.

   ```env
   # This URI string is for Atlas Edge Server
   EDGE_SERVER_URI="mongodb://localhost:27021"

   # This port is for the Node.js server
   PORT=5055
   ```

6. Then run `npm run start`.
7. Explore how CRUD works from both the React Client and the App Services UI.

When you're done with the template app, make sure to shut everything down,
including the Edge Server. From the project's root directory, run
`npm run shut-down`.

## Create an App Services App

Edge Server connects to Atlas through an App Services App backend.
For this example application, you'll create an App Services App based on the
`edge-server.todo` template app.

This template app uses a backend with Atlas Device Sync enabled and configured with:

- An pre-defined `Item` collection in a `todo` database
- Three rules:
  - A default rule that allows _any_ user to read, but not write, Items to
    the collection
  - A rule that allows the Edge Server to read and write Items to the collection
  - A rule that allows Atlas Device SDK client users to read all Items, but only
    write their own Items to the collection

> **NOTE:** You must use the `edge-server.todo` template app. You can sync data
> with Atlas Device SDK clients if they connect to the Edge Server.

### Set up your MongoDB Atlas account

You will need the following to create an App in the CLI:

- A MongoDB Atlas account with Project Owner permissions. To learn how to
  sign up for a free account, refer to
  [Get Started with Atlas](https://www.mongodb.com/docs/atlas/getting-started).
- A cluster deployed in your project. To learn how to deploy an M0 free
  cluster, refer to
  [Create a Cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/).
- A project API key with Project Owner permissions. To learn how to create a
  key, refer to
  [Create an API Key for a Project](https://www.mongodb.com/docs/atlas/configure-api-access/#invite-an-organization-api-key-to-a-project).

### Create an App with App Services CLI

Install [App Services CLI](https://www.mongodb.com/docs/atlas/app-services/cli/):

```shell
npm install -g atlas-app-services-cli
```

Login with your API key using
[appservices login](https://www.mongodb.com/docs/atlas/app-services/cli/appservices-login/):

```shell
appservices login \
--api-key <your-public-key> \
--private-api-key <your-private-key>
```

Create an app based on the `edge-server.todo` template using
[appservices apps create](https://www.mongodb.com/docs/atlas/app-services/cli/appservices-apps-create/).

The following creates an app named "EdgeServerApp" that uses the
template's pre-configured backend. The command creates a new `EdgeServerApp`
directory in your current path containing the backend files:

```shell
appservices app create \
--name EdgeServerApp \
--template edge-server.todo
```

If the app is created successfully, you should see a JSON
blob that includes the generated `client_app_id` similar to:

```shell
{
  "client_app_id": "edgeserverapp-abc123",
  "filepath": "/current_path/EdgeServerApp",
  "url": "https://realm.mongodb.com/groups/1234567890abcdefghijk/apps/1234567890abcdefghijk/dashboard",
  "backend": "/current_path/EdgeServerApp/backend",
  "frontends": "/current_path/EdgeServerApp/frontend",
  "clusters": [
    {
      "name": "mongodb-atlas"
    }
  ]
}
```

You now have an App Services App with a configured backend and an App Services
App ID.

> **NOTE:** The `client_app_id` is your App Services App ID. You will need it later steps.

While Edge Server is in Private Preview, the `frontends` directory listed in
the blob does not apply to this template. You can only get the Edge Server
client from this GitHub repository: https://github.com/mongodb/template-app-edge-server/

Additionally, the "View directions on how to run the template app:" text does
not contain information about running the Edge Server template. You can view
the Edge Server client README - this document you're currently viewing - for
those details.

## Enable Edge Server for your App

After your App is created, coordinate with your Product or Account Representative
to enable Edge Server and generate an authorization secret for your app.

You will need to provide the App Sevices App ID.
If you don't know your App ID, you can get it from the CLI using:

```shell
appservices apps list
```

For other ways to find your App Services App ID, refer to
[Find Your App ID](https://www.mongodb.com/docs/atlas/app-services/apps/metadata/#find-your-app-id)

## Download, configure, and start the Edge Server

To download, configure, and start the Edge Server, complete these steps:

1. Get the Edge Server code.
2. Complete the Edge Server configuration details.
3. Install required dependencies to run the Edge Server.
4. Run the Edge Server.

This example application assumes that you're running the Edge Server and
the example application on your local machine.

### Get the Edge Server code

In the project's root directory, use wget to get the current Edge Server code
as a .tar file:

```shell
wget --content-disposition https://services.cloud.mongodb.com/api/client/v2.0/tiered-sync/package/latest
```

Unzip the .tar to get the files:

```shell
tar -xvf *.tgz
```

You now have an `edge_server` directory containing the server files. For the
project's npm scripts to work, the `edge_server` directory should be at the same
level as the `node-server` and `react-client` directories:

```shell
| - <edge-server-template-app>
|  | - node-server
|  | - react-client
|  | - edge_server
```

### Configure the Edge Server

The `edge_server` directory contains a `config.json` file you must edit with
the appropriate values to configure the server.

Replace the `clientAppId` value with the App Services App ID for the Edge Server-enabled App
you created above. For information about how to find the App Sevices App ID,
refer to
[Find Your App ID](https://www.mongodb.com/docs/atlas/app-services/apps/metadata/#find-your-app-id).

Replace the `cloudSyncServerAuthSecret` value with the auth secret for your
Edge Server.

For more details about this configuration file, refer to the
[Configure Edge Server](https://www.mongodb.com/docs/atlas/app-services/edge-server/configure/#complete-the-edge-server-configuration-details)
documentation.

### Install required dependencies to run the Edge Server

The `edge_server` directory contains a `README.md` file with instructions
for installing dependencies and starting the Edge Server. The host running
the Edge Server must have `docker`, `docker-compose`, `make` and `jq`
installed.

For computers running macOS, we recommend using `brew` to install required
dependencies.

### Run the Edge Server

Make sure Docker is running on your local machine. Then, run the following
command to start the Edge Server:

```shell
make up
```

You can check the Edge Server's status at any time using the following command:

```shell
make status
```

We recommend checking the Edge Server's status after you run it for the
first time to confirm that you have successfully configured the Edge Server
and it is running. If it is successfully configured, you should see a JSON
blob similar to:

```json
{
  "version": "v0.16.0",
  "status": "ACTIVE",
  "cloud_connected": true,
  "num_local_clients": 0,
  "query": {
    "Item": "truepredicate"
  }
}
```

To stop the Edge Server, run the following command:

```shell
make down
```

For a proof-of-concept test app, we recommend stopping the Edge Server when
it's not in use. While it is running, it continues to check in regularly with
the Atlas Sync server, even if no clients are connected to it.

## Install Express and React dependencies and start servers

1. Install and configure the Edge Server. You must [install the Edge Server dependencies](#install-required-dependencies-to-run-the-edge-server) yourself.
2. Install the Express server and React client dependencies. From the project
   root, run:

   ```shell
   npm run install-deps
   ```

3. Add a `.env` file inside the `node-server` directory with the details
   required to run the Express Server.

   ```env
   # This URI string is for Atlas Edge Server
   EDGE_SERVER_URI="mongodb://localhost:27021"

   # This port is for the Node.js server
   PORT=5055
   ```

4. Start the Edge Server, Express server, and React client server. From the
   project root, run:

   ```shell
   npm run start
   ```

   This should open a browser window with the UI where you can perform CRUD
   operations through the Express server that is connected to the Edge Server.
   You can open Atlas and see your updates reflected there.

   If this doesn't open a browser, you can open one and navigate to the following
   URL to view the React app:

   ```
   http://localhost:3000/
   ```

5. When you're done, shut down all three servers. From the project root, run:

```shell
npm run shut-down
```

### Troubleshooting

#### Cannot read properties of undefined (reading 'startsWith')

When you run the Express server, you may see this error:

```shell
[1]     PATH/edge-server/node-server/node_modules/mongodb-connection-string-url/lib/index.js:9
[1]     return (connectionString.startsWith('mongodb://') ||
```

This error occurs when there is no `.env` file at the root of your
`node-server` directory containing an `EDGE_SERVER_URI`. Add the `.env`
file as detailed above.

#### Address Already in Use

When you run the Express server, you may see this error:

```shell
EADDRINUSE, Address already in use
```

This indicates that another device on your machine is using the port that
the Express server is trying to use to listen for incoming connections.
This example app uses port `5055` by default.

You can change the port used in your `.env` file at the root of the
`node-server` directory. If you change this port, you must also change
the port that the React client uses to communicate with the Express server.
Change the port in `react-client/src/endpoints.ts` on line 4 to match
the new port in your `.env` file:

```typescript
const baseUrl: string = "http://localhost:5055";
```

#### Connection refused

When you run the Express server, you may see 'Connecting to Edge Server...'
for a long period of time, followed by this error:

```shell
connect ECONNREFUSED ::1:27021, connect ECONNREFUSED 127.0.0.1:27021
```

This indicates that the Edge Server is not running on port 27021. Verify
that the Edge Server is running. If you have changed the URI and/or port where
the Edge Server is listening for wireprotocol connections, change the URI
and/or port in your `.env` file.

## Using the React client

### Add, Update, and Delete Items

The React client is a simple app where you can create, read, update, and
delete items. Changes that you make from the React app use the Node.js Driver
in the Express server to perform CRUD operations with the MongoDB instance
running in the Edge Server. The Edge Server then syncs these changes to Atlas.

You can see the changes that you make in the React app reflected in Atlas.

When you make changes in Atlas, you can reload the React app to see the changes
reflected in the browser.

### Troubleshooting

#### Stuck on loading view

When you run the React client, you may encounter an issue where the
'Edge Server Wire Protocol App' UI displays an endless loading progress
indicator.

This can indicate two possible issues:

- The Express server isn't running
- Edge Server isn't running

Confirm that both servers are running and try again.

#### My new Item added in Atlas doesn't show up in the React client

When you add a new `Item` in Atlas, it doesn't show up automatically in
the React client. The client does not have a listener observing changes
to the collection. You can manually reload the React client to view the
new `Item`.

If you reload the React client and it still doesn't show the new `Item`,
check:

- The Edge Server is running
- The Node.js Express server is running
- The schema of the `Item` you added in Atlas matches the App Services Schema
  for the Edge Server App, with required fields of the appropriate types:

```json
{
  "title": "Item",
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "isComplete": {
      "bsonType": "bool"
    },
    "owner_id": {
      "bsonType": "string"
    },
    "summary": {
      "bsonType": "string"
    }
  },
  "required": ["_id", "owner_id", "isComplete", "summary"]
}
```

If you've confirmed these details and you still don't see the new `Item`
that you added in Atlas reflected in the React client, check the App Services
logs and Edge Server for error messages.

For information about how to check the App Services logs, refer to
[View Application Logs](https://www.mongodb.com/docs/atlas/app-services/activity/view-logs/)

## Issues

Please report issues with the template at: https://github.com/mongodb-university/realm-template-apps/issues/new
