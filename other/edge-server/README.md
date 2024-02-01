# Edge Server with MongoDB Node.js Driver

This example application uses the MongoDB Node.js Driver to connect to 
Edge Server. It has a React frontend for performing CRUD operations. It uses 
the MongoDB Node.js Driver in an Express server application to connect to
the Edge Server.

React client -> Express server (Node.js Driver) -> Edge Server -> Atlas

To use this example application, you must:

1. Create an App Services App using the backend configuration provided in
  this project's [TODO: Cory insert directory name here] directory.
2. Download, configure, and start the Edge Server.
3. Install dependencies and start the Node.js Express server.
4. Install dependencies and start the React server.

This is a MERN stack that connects to the Edge Server instead of Atlas. For
a MERN stack tutorial, refer to 
[How to Use Mern Stack: A Complete Guide](https://www.mongodb.com/languages/mern-stack-tutorial).

## Create an App Services App

TODO: Cory to write instructions for creating the backend using the provided
dir.

We should probably note:

- What things are enabled in this App backend (Sync, anonymous auth, only a 
  default rule that is open to the internet)
- Maybe how this differs from the sync-todo backend? I don't know if we want
  to contrast it with using the Device SDK todo template app as it's slightly different

We may also want to note - maybe not here but maybe up above somewhere - that
wireprotocol connections connect directly to Edge Server without authorization.

## Download, configure, and start the Edge Server

To download, configure, and start the Edge Server, complete these steps:

1. Get the Edge Server code.
2. Complete the Edge Server configuration details.
3. Install required dependencies to run the Edge Server.
4. Run the Edge Server.

This example application assumes that you're running the Edge Server and
the example application on your local machine.

### Get the Edge Server code

Use wget to get the current Edge Server code as a .tar file:

```shell
wget --content-disposition https://services.cloud.mongodb.com/api/client/v2.0/tiered-sync/package/latest
```

Unzip the .tar to get the files:

```shell
tar -xvf *.tgz
```

You now have an `edge_server` directory containing the server files.

### Complete the Edge Server configuration details

The `edge_server` directory contains a `config.json` file you must edit with 
the appropriate values to configure the server.

Replace the `clientAppId` value with the App Services App ID for the App
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

## Install dependencies and start the Node.js Express server

With the Edge Server running, cd into the `node-server` directory.

Install the required dependencies:

```shell
npm install
```

Add a `.env` file inside the `node-server` directory with the details 
required to run the Express Server.

```env
# This URI string is for Atlas Edge Server
EDGE_SERVER_URI="mongodb://localhost:27021"

# This port is for the Node.js server
PORT=5000
```

Then, run the Express server:

```shell
npm run start
```

### Troubleshooting

#### Cannot read properties of undefined (reading 'startsWith')

When you run the Express server, you may see this error:

```shell
[1]     PATH/edge-server/node-server/node_modules/mongodb-connection-string-url/lib/index.js:9
[1]     return (connectionString.startsWith('mongodb://') ||
```

This error occurs when there is no `.env` file at the root of your `node-server`
directory containing an `EDGE_SERVER_URI`. Add the `.env` file as detailed
above.

#### Address Already in Use

When you run the Express server, you may see this error:

```shell
EADDRINUSE, Address already in use
```

This indicates that another device on your machine is using the port that
the Express server is trying to use to listen for incoming connections.
This example app uses port `5000` by default.

You can change the port used in your `.env` file at the root of the 
`node-server` directory. If you change this port, you must also change
the port that the React client uses to communicate with the Express server.
Change the port in `react-client/src/endpoints.ts` on line 4 to match
the new port in your `.env` file:

```typescript
const baseUrl: string = "http://localhost:5000";
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

## Install dependencies and start the React server

With the Edge Server running, cd into the `react-client` directory.

Install the required dependencies:

```shell
npm install
```

Then, run the React client:

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
