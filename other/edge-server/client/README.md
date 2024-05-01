# Edge Server with MongoDB Node.js Driver

This example todo application demonstrates using Atlas Edge Server with a MongoDB Driver.
It uses the [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
in an Express server application to connect to Edge Server. It has a React
frontend for performing CRUD operations.

React client -> Express server (Node.js Driver) -> Edge Server -> Atlas

This is a MERN stack that connects to the Edge Server instead of Atlas.
In this version of the example app, MongoDB wire protocol connections connect
directly to Edge Server. You can use email/password authentication with an
App Services user or bypass authentication altogether.

For a MERN stack tutorial, refer to
[How to Use Mern Stack: A Complete Guide](https://www.mongodb.com/languages/mern-stack-tutorial).

Atlas Edge Server is currently in Public Preview. To learn more about Edge Server,
refer to the product page at [Edge Server](https://www.mongodb.com/products/platform/atlas-edge-server)
and the [Edge Server documentation](https://www.mongodb.com/docs/atlas/app-services/edge-server/).

## Quick Start

1. Create an App Services App based on the `edge-server.todo` template app. Refer
   to [the documentation](https://www.mongodb.com/docs/atlas/app-services/reference/template-apps/#create-a-template-app) for details.
2. [Create a Service for Edge Server](https://www.mongodb.com/docs/atlas/app-services/edge-server/manage-edge-servers/#create-a-service-for-edge-server)
3. Start Docker
4. [Install and Configure the Edge Server Instance](https://www.mongodb.com/docs/atlas/app-services/edge-server/configure/#install-and-configure-the-edge-server-instance)
5. As part of the Edge Server installation, choose to create a new user. Remember
   the user's email and password for later.
   Alternatively, you can skip user creation and disable authentication by running `edgectl config --insecure-disable-auth=true`.
6. From the project's root directory, run `npm run install-deps`.
7. Add a `.env` file inside the `express-server` directory with the details
   required to run the Express Server.

   ```env
    # The Edge Server uses this connection string for anonymous authentication
    EDGE_SERVER_URI="mongodb://localhost:27021"

    # This port is for the Express server
    PORT=5055
   ```

8. From the project's root directory, run `npm run start`.
9. In the rendered React client, either bypass authentication or use the email
   and password for the user you created earlier.

When you're done with the template app, make sure to shut everything down,
including the Edge Server. From the project's root directory, run
`npm run stop`.

## Project npm commands

- `install-deps`: installs the dependencies for the Express server and
  React client. You must install the Edge Server dependencies separately.
- `start`: starts the Edge Server, Express server, and React client.
- `stop`: shuts down the Edge Server, Express server, and React client.

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

## Set up Edge Server

Before you can run the template app in this repo, you need to have a functional
Edge Server.

To set up an Edge Server:

1. [Create a Service for Edge Server](https://www.mongodb.com/docs/atlas/app-services/edge-server/manage-edge-servers/#create-a-service-for-edge-server)
2. [Install and Configure the Edge Server Instance](https://www.mongodb.com/docs/atlas/app-services/edge-server/configure/#install-and-configure-the-edge-server-instance)

For more information about Atlas Edge Server instance, refer to the [Edge Server documentation](https://www.mongodb.com/docs/atlas/app-services/edge-server/).

## Install Express and React dependencies and start servers

1. Install and configure the Edge Server. You must install the Edge Server dependencies yourself for details, refer to the [Edge Server documentation](https://www.mongodb.com/docs/atlas/app-services/edge-server/).
2. Install the Express server and React client dependencies. From the project
   root, run:

   ```shell
   npm run install-deps
   ```

3. Add a `.env` file inside the `express-server` directory with the details
   required to run the Express Server.

   ```env
    # The Edge Server uses this connection string for anonymous authentication
    EDGE_SERVER_URI="mongodb://localhost:27021"

    # This port is for the Express server
    PORT=5055
   ```

4. Start the Edge Server, Express server, and React client server. From the
   project root, run:

   ```shell
   npm run start
   ```

   This should open a browser window with the UI where you can either bypass
   authentication or pass a user's email address and password to the Edge Server. After logging in, you can perform CRUD operations through the Express server
   that is connected to the Edge Server. You can open Atlas and see your updates reflected there.

   If a browser windwo doesn't open automatically, you can open one and navigate
   to the following URL to view the React app:

   ```
   http://localhost:3000/
   ```

5. When you're done, shut down all three servers. From the project root, run:

   ```shell
   npm run stop
   ```

## Run Multiple Edge Server Instances on a Host

If your device has multiple Edge Server instances, running this project's `npm run start` script uses the default `edgectl` profile. If you want to use a different profile, you must run the Edge Server with the appropriate --profile flag, and run the express-server and react-client separately.

See the [Edge Server documentation](https://www.mongodb.com/docs/atlas/app-services/edge-server/configure/#run-multiple-edge-server-instances-on-a-host) for more details.

## Using the React client

### Authenticate

Before you can read or write any data from the Edge Server, you must either
bypass authentication or log in with a user email address and password.

You can manage users in the App Services UI. If you don't have one yet, you
can create a new user that uses email/password authentication. See the App
Services [authenticate and manage users docs](https://www.mongodb.com/docs/atlas/app-services/users/) for details.

### Add, Update, and Delete Items

The React client is a simple app where you can create, read, update, and
delete items. Changes that you make from the React app use the Node.js Driver
in the Express server to perform CRUD operations with the MongoDB instance
running in the Edge Server. The Edge Server then syncs these changes to Atlas.

You can see the changes that you make in the React app reflected in Atlas.
The React client fetches todos from the Edge Server every 5 seconds.

## Issues

Please report issues with the template at: https://github.com/mongodb-university/realm-template-apps/issues/new
