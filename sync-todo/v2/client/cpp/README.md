# C++ Template App

A todo list application built with the [Atlas Device SDK for C++](https://www.mongodb.com/docs/realm/sdk/cpp/) and [Atlas Device Sync](https://www.mongodb.com/docs/atlas/app-services/sync/).

This app uses a terminal UI built with [FTXUI](https://github.com/ArthurSonzogni/FTXUI).

## Configuration

For this template app to work, you must ensure that `atlasConfig.json` exists and contains the following properties:

- **appId:** your Atlas App Services App ID.
- **appUrl:** the URL to browse directly to your App Services App.
- **baseUrl:** the App Services backend URL. This should be https://services.cloud.mongodb.com in most cases.
- **clientApiBaseUrl:** the deployment region and baseURL a client application can use to connect to a specific regional deployment.
- **dataApiBaseUrl:** the deployment region and Data API baseURL a client application can use to connect to a specific Data API app in a given region.
- **dataExplorerLink:** the URL to browse to your collections in Atlas. Go here to see data syncing from your app.
- **dataSourceName:** the name of the data source in Atlas. This information is not used by this template app.

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

Once you have created the App Services App, replace any value in this client's
`appId` field with your App Services App ID. For help finding this ID, refer
to: [Find Your Project or App Id](https://www.mongodb.com/docs/atlas/app-services/reference/find-your-project-or-app-id/)

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

- Run the executable.

  ```shell
     ./sync_todo
  ```

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new

### Troubleshooting

#### Attempting to parse an empty input

If your `atlasConfig.json` does not exist, or the path to this file is not correct, you may encounter this error:

```shell
terminating due to uncaught exception of type nlohmann::json_abi_v3_11_3::detail::parse_error: 
[json.exception.parse_error.101] parse error at line 1, column 1: attempting to parse an empty input; 
check that your input string or stream contains the expected JSON
```

Confirm that the `atlasConfig.json` exists in the project. If you did not make the `build` directory inside this project
directory, update the path in `main.cpp` at line 28 to match the path of the `atlasConfig.json` on your system.