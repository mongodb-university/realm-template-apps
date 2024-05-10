# C++ Template App

A todo list application built with the [Atlas Device SDK for C++](https://www.mongodb.com/docs/realm/sdk/cpp/) and [Atlas Device Sync](https://www.mongodb.com/docs/atlas/app-services/sync/).

This app uses a terminal UI built with [FTXUI](https://github.com/ArthurSonzogni/FTXUI).

## Configuration

For this template app to work, you must ensure that `atlasConfig.json` exists and contains the following properties:

- **appId:** your Atlas App Services App ID.
- **appUrl:** the URL to browse directly to your App Services App.
- **baseUrl:** the App Services backend URL. This should be https://services.cloud.mongodb.com in most cases.
- **clientApiBaseUrl:** the deployment region and baseURL a client application can use to connect to a specific regional 
  deployment. This information is not used by this template app.
- **dataApiBaseUrl:** the deployment region and Data API baseURL a client application can use to connect to a specific 
  Data API app in a given region. This information is not used by this template app.
- **dataExplorerLink:** the URL to browse to your collections in Atlas. Go here to see data syncing from your app.
- **dataSourceName:** the name of the data source in Atlas. This information is not used by this template app.

## Create an Atlas Device Sync Template App

### Create the Template App using App Services CLI

The easiest way to work with this client is to create the template app using App Services CLI. If you use the CLI to
create the template app, or if you use the CLI to pull the C++ client you created from the App Services UI, you'll get
a version of this client with the `atlasConfig.json` pre-populated with the appropriate values for your application.

For more information, refer to the [Template App documentation](https://www.mongodb.com/docs/atlas/app-services/reference/template-apps/).

### Cloning from GitHub

If you have cloned this repository from the GitHub
[mongodb/template-app-cpp-todo](https://github.com/mongodb/template-app-cpp-todo.git)
repository, you must create a separate App Services App with Device Sync
enabled to use this client. You can find information about how to do this
in the Atlas App Services documentation page:
[Template Apps -> Create a Template App](https://www.mongodb.com/docs/atlas/app-services/reference/template-apps/)

Once you have created the App Services App, replace the value in this client's `appId` field 
in the `atlasConfig.json` file with your App Services App ID. For help finding this ID, refer
to: [Find Your Project or App ID](https://www.mongodb.com/docs/atlas/app-services/reference/find-your-project-or-app-id/)

### Making a Template App in the App Services UI

You can create a template app by logging on to [Atlas App Services](https://services.cloud.mongodb.com) and click the
**Create App From Template** button. Choose **Real Time Sync**, and then follow the prompts.

You can download some of the Sync clients from the UI as a .zip file. That is not possible at this time for the C++ client.
To get a copy of the C++ client with `atlasConfig.json` values pre-populated with the data for your app, pull a copy of
the template app client using App Services CLI. For more information, refer to the Atlas App Services documentation page:
[Template Apps -> Get a Template App Client](https://www.mongodb.com/docs/atlas/app-services/reference/template-apps/#get-a-template-app-client).

## Run the app

This app uses CMake to manage dependencies. You must have CMake installed to use this template app.

- Make a `/build` directory inside this client directory, and `cd` into it.

  ```shell
     mkdir build && cd build
  ```

- Use CMake to create the Makefile

  ```shell
     cmake ../
  ```

- Use CMake to build the app executable.

  ```shell
     cmake --build .
  ```

- Run the executable. Pass the path to the `atlasConfig.json` as an argument when you run the application.

  ```shell
     ./sync_todo /path-to-file/atlasConfig.json
  ```

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new

### Known Issues

If the error modal displays, and you move your mouse over the item  list in the terminal prior to dismissing the error 
modal, the UI rendering breaks. This is related to limitations with the FTXUI library. If this occurs, quit the app 
using `ctrl + c`, and re-run it. You can avoid this issue by using the enter key to press the `Dismiss` button in the
error modal before moving the mouse.

## Structure

To see the code examples concerned with Atlas Device SDK for C++, these files are the most relevant:

- Controllers:
  - `app_controller.cpp`: Set up app state, including reading the `atlasConfig.json` and setting up the Atlas App connection.
  - `home_controller.cpp`: Create the task list, add new items, and let the user change app state.
- Managers
  - `auth_manager.cpp`: Authenticate users with the Atlas Device Sync app.
  - `database_manager.cpp`: Handle Device Sync client configuration, Sync subscriptions, Sync sessions, and database CRUD operations.
- State
  - `item.hpp`: The Atlas Device SDK data model.

```
├── controllers
│   ├── app_controller.cpp
│   ├── app_controller.hpp
│   ├── controller.hpp
│   ├── home_controller.cpp
│   ├── home_controller.hpp
│   ├── login_controller.cpp
│   ├── login_controller.hpp
│   ├── navigation.cpp
│   └── navigation.hpp
├── main.cpp
├── managers
│   ├── auth_manager.cpp
│   ├── auth_manager.hpp
│   ├── database_manager.cpp
│   ├── database_manager.hpp
│   ├── error_manager.cpp
│   └── error_manager.hpp
├── ss.hpp
├── state
│   ├── app_config_metadata.cpp
│   ├── app_config_metadata.hpp
│   ├── app_state.hpp
│   ├── home_controller_state.hpp
│   ├── item.hpp
│   ├── offline_mode_selection.hpp
│   └── subscription_selection.hpp
└── views
    ├── scroller.cpp
    └── scroller.hpp
```