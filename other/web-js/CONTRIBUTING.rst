==============================================
How to Develop & Release the Web Template Apps
==============================================

This project is used as a single source for multiple generated apps. We
use `Bluehawk <https://github.com/mongodb-university/Bluehawk/>`_ to
generate the apps based on special comments in the code. The generated
apps are also referred to as "artifact" projects.

This section outlines how to develop and release new features.

Writing Client-Specific Code
----------------------------

Most of the code in this project is shared between the generated apps.
For example, all of the apps render the same UI and use the same React
components.

However, there are some places where you may want to write code that is
specific to a single app. For example, you may want to add a new
component that is only used in the GraphQL app.

To do this, you can use Bluehawk's ``state`` feature. This feature
allows you to write code that is only included in a specific generated
app.

This app uses the following states:

- ``dev``: The development project. This state is used when you run the
  app locally from the ``client`` directory. It lets you simulate all of
  the generated apps by changing the ``VITE_API_TYPE`` environment
  variable.

- ``prod-graphql``: The GraphQL artifact project.

- ``prod-mql``: The MQL artifact project.

- ``prod-data-api``: The Data API artifact project.

To write code that is only included in a specific app, use the
``state-start`` and ``state-end`` tags:

.. code-block:: js

   // :state-start: prod-graphql
   // This code is only included in the generated GraphQL app.
   // It's uncommented, so the dev client will also run it.
   graphql_specific_code();
   // :state-end:

You might also want to write code that is specific to each client and
then simulate that code in the development app. To do that, you can use
the ``state-uncomment-start`` and ``state-uncomment-end`` tags:

.. note::

   The ``state-uncomment-start`` and ``state-uncomment-end`` tags
   currently don't support a list of states. This means that, even if
   the code for two states is the same, you have to repeat yourself for
   both states. We can fix this in Bluehawk to make this much simpler!
   See `mongodb-university/Bluehawk#139
   <https://github.com/mongodb-university/Bluehawk/issues/139>`_.

.. code-block:: js

   // :state-uncomment-start: prod-graphql
   // // This code is only included in the generated GraphQL app.
   // const getTodos = getTodosWithGraphQL;
   // :state-uncomment-end:
   // :state-uncomment-start: prod-mql
   // // This code is only included in the generated MQL app.
   // const getTodos = getTodosWithMQL;
   // :state-uncomment-end:
   // :state-uncomment-start: prod-data-api
   // // This code is only included in the generated Data API app.
   // const getTodos = getTodosWithDataAPI;
   // :state-uncomment-end:
   // :state-start: dev
   // This code is only included in the development app.
   const getTodos = {
     "graphql": getTodosWithGraphQL,
     "mql": getTodosWithMQL,
     "data-api": getTodosWithDataAPI,
   }[process.env.VITE_API_TYPE]
   // :state-end:
   // This code is included in all of the apps.
   shared_code();

Generate the Artifact Projects
------------------------------

To generate all of the artifact projects, run the following command in
your shell from the ``web-js`` project root:

.. code-block:: sh

   ./bluehawk.sh

**NOTE:** The `bluehawk.sh` script relies on `jq`. If you don't have it,
you can install by running `brew install jq` or by [downloading the
binary](https://jqlang.github.io/jq/) and adding it to your path.

Build & Run the Development App Locally
---------------------------------------

When you're developing the client, you'll probably want to run the
source app locally. This lets you test your changes in real time without
needing to run Bluehawk to generate the artifact projects every time.

0. Clone this Repository
~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: sh

   gh repo clone mongodb-university/realm-template-apps
   cd realm-template-apps

1. Download & Install Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Bluehawk does not include ``node_modules`` when you generate an artifact
project. If you want to run the generated code, you'll need to run `npm
install` in the generated project directory first.

.. code-block:: sh

   cd other/web-js/client
   npm install

2. Define the API Type
~~~~~~~~~~~~~~~~~~~~~~

This app is built to use a pluggable backend API that conforms to the
``useTodo()`` hook interface. You can either use a pure MQL
implementation, your app's GraphQL API, or the Data API.

To set a default development API type, open the ``.env`` file and
specify either ``"graphql"``, ``"mql"``, or ``"data-api"`` for
``VITE_API_TYPE``:

.. code-block:: sh

   VITE_API_TYPE="graphql"
   # VITE_API_TYPE="mql"
   # VITE_API_TYPE="data-api"

*Note that the artifact projects don't use a ``.env`` file - it's only
for development!*

You can also use a specific command to run your preferred API type. For
example, to run the GraphQL app regardless of what's defined in
``.env``, run ``npm run dev:graphql``.

3. Create an App Services App
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Choose the appropriate backend:

- GraphQL: ``other/web-js/backend``
- MQL: ``other/web-js/backend``
- Data API: ``other/web-js/backend-data-api``

and deploy a copy for yourself:

.. code-block:: sh

   npx atlas-app-services-cli login
   npx atlas-app-services-cli push --local backend

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

5. Run the App
~~~~~~~~~~~~~~

.. code-block:: sh

   npm run start

Run the Integration Tests
-------------------------

The integration tests are written in ``App.test.jsx``. They run against
the App specified in ``src/atlasConfig.json``.

You have a few options for running them.

Run the Tests Manually
~~~~~~~~~~~~~~~~~~~~~~

- Run the tests against the development app:

  .. code-block:: sh

     cd client
     npm run test

  You can run the tests for a specific backend by using a more specific
  command:

  .. code-block:: sh

     npm run test:graphql

- Run the tests against a generated app:

  .. code-block:: sh

     # You need to have a metadata file for the generated app
     cp client/src/atlasConfig.json generated/prod-graphql/client/src/atlasConfig.json
     # You can also use the create-metadata-file.sh script
     ../../create-metadata-file.sh backend generated/prod-graphql/client/src/atlasConfig.json

     cd generated/prod-graphql
     npm run test

Run Fully Automated Tests
~~~~~~~~~~~~~~~~~~~~~~~~~

The tests are also automated into an integration test suite that's run
in GitHub Actions. You can run the full suite locally by either directly
calling the integration test script or by simulating the GHA.

- Run the integration test script. The flags are:

  - ``-d``: The path to the backend directory
  - ``-t``: The path to the copy of the backend directory used in this test
  - ``-s``: The name of the state to test
  - ``-c``: The name of the Atlas cluster to use

  .. code-block:: sh

     ./integration-test.sh \
       -d backend-data-api \
       -t backend-data-api-tester \
       -s prod-data-api \
       -c Cluster0

- You can use `act <https://github.com/nektos/act>`_ to run the GHA
  locally from the repo root (you will need to provide an Atlas API Key
  pair):

  .. code-block:: sh

     ATLAS_PUBLIC_API_KEY="abcdefgh"
     ATLAS_PRIVATE_API_KEY="11111111-0ff0-1337-h4c2-f00b470ec112"
     act -j web-js-integration-test \
       -s ATLAS_PUBLIC_API_KEY \
       -s ATLAS_PRIVATE_API_KEY \
       --container-architecture linux/amd64
