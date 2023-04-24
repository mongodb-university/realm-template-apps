==============================
Atlas App Services Web Starter
==============================

This project contains the web client for the Atlas App Services template
application.

The client allows you to:

- Sign up and log in as an Email/Password user

- Create, check off, and delete to-do items

The client connects to Atlas App Services using `Remote MongoDB Queries <https://mongodb.com/docs/realm/web/mongodb/>`_ from the Realm SDK.

Set Up and Run the App
----------------------

To run the app locally, install its dependencies and then call the run script:

.. code-block:: shell
   
   npm install

.. code-block:: shell
   
   npm run start

Metadata File
-------------

The client uses a metadata file, ``src/atlasConfig.json``, to configure
its connection to Atlas App Services. If you created this project
through MongoDB Atlas or the App Services CLI then the file is
pre-populated with your connection info.
