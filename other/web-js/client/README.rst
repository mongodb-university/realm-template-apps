==============================
Atlas App Services Web Starter
==============================

This project contains the web client for the Atlas App Services template application.
The client allows you to:

- Sign up and log in as an Email/Password user

- Create, check off, and delete to-do items

.. :state-start: dev

The client allows you to connect using:

- The App Services `GraphQL API <https://mongodb.com/docs/atlas/app-services/graphql/>`_
- The App Services `Data API <https://mongodb.com/docs/atlas/app-services/data-api/>`_
- Realm Web SDK `Remote MongoDB Queries <https://mongodb.com/docs/realm/web/mongodb/>`_

Generate Artifact Projects
--------------------------

This project is used as a single source for multiple generated apps. We use
`Bluehawk <https://github.com/mongodb-university/Bluehawk/>`_ to generate the
apps based on special comments in the code.

To generate all of the artifact projects, run the following commands in your
shell from the ``web-js`` project root:

.. code-block:: sh
   
   npm run generate:prod

You can also generate a specific artifact project:

.. code-block:: sh
   
   npm run generate:prod-graphql

.. code-block:: sh
   
   npm run generate:prod-mql

.. code-block:: sh

   npm run generate:prod-data-api

🧰 **Install Dependencies to Run Artifact Projects**: Bluehawk does not include
``node_modules`` when you generate an artifact project. If you want to run the
generated code, you'll need to run `npm install` first.

Build & Run the Development App Locally
---------------------------------------

1. Download & Install Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can download the app from the Realm UI, with Realm CLI, or by cloning this repository:

.. code-block:: sh
   
   gh repo clone mongodb-university/realm-template-apps
   cd realm-template-apps/other/web-js/client
   npm install

2. Define the API Type
~~~~~~~~~~~~~~~~~~~~~~

This app is built to use a pluggable backend API that conforms to the
``useTodo()`` hook interface. You can either use a pure MQL
implementation, your app's GraphQL API, or the Data API. *Note that the
artifact projects don't use a ``.env`` file - it's only for
development!*

Open the ``.env`` file and specify either ``"graphql"``, ``"mql"``, or
``"data-api"`` for ``VITE_API_TYPE``:

.. code-block:: sh
   
   VITE_API_TYPE="graphql"
   # VITE_API_TYPE="mql"
   # VITE_API_TYPE="data-api"

3. Create an App Services App
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Choose the appropriate backend:

- GraphQL: ``other/web-js/backend``
- MQL: ``other/web-js/backend``
- Data API: ``other/web-js/backend-data-api``

and deploy a copy for yourself:

.. code-block:: sh

   npx mongodb-realm-cli login
   npx mongodb-realm-cli push --local backend

4. Create a Metadata File
~~~~~~~~~~~~~~~~~~~~~~~~~

You need a metadata file to connect to your app. Use the
``create-metadata-file.sh`` script in the project root to create one:

.. code-block:: sh
   
   ./create-metadata-file.sh other/web-js/backend other/web-js/client/src/atlasConfig.json

The result should look like the following but with values specific to your App:

.. code-block:: json

   {
     "appId": "myapp-abcde",
     "baseUrl": "https://realm.mongodb.com",
     "appUrl": "https://realm.mongodb.com/groups/642da640aa2afcfdaada4834/apps/642da64426fda9654422da0e/",
     "dataSourceName": "mongodb-atlas",
     "clientApiBaseUrl": "https://realm.mongodb.com",
     "dataApiBaseUrl": "https://data.mongodb-api.com"
   }

4. Run the App
~~~~~~~~~~~~~~

.. code-block:: sh
   
   npm run start

.. :state-end:

.. :state-uncomment-start: prod-graphql
.. The client allows you to connect using the Atlas App Services `GraphQL API <https://mongodb.com/docs/atlas/app-services/graphql/>`_.
.. :state-uncomment-end:
.. :state-uncomment-start: prod-mql
.. The client allows you to connect using Realm's `remote MongoDB queries <https://mongodb.com/docs/realm/web/mongodb/>`_.
.. :state-uncomment-end:
.. :state-uncomment-start: prod-data-api
.. The client allows you to connect using the Atlas App Services `Data API <https://mongodb.com/docs/atlas/app-services/data-api/>`_.
.. :state-uncomment-end:

Set Up and Run the App
----------------------

To run the app locally, install its dependencies and then call the run script:

.. code-block:: shell
   
   npm install

.. code-block:: shell
   
   npm run start
