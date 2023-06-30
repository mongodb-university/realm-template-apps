﻿# Xamarin C# Template App

## Configuration

Ensure `realm-todo-dotnet/realm.json` exists and contains the following properties:

- **appId:** your Atlas App Services App ID.
- **baseUrl:** the Realm backend URL. Should be https://realm.mongodb.com in most cases.

### Cloning from GitHub

If you have cloned this repository from the GitHub
[mongodb/template-app-xamarin-todo](https://github.com/mongodb/template-app-xamarin-todo.git)
repository, you must create a separate App Services App with Device Sync
enabled to use this client. You can find information about how to do this
in the Atlas App Services documentation page:
[Template Apps -> Create a Template App](https://www.mongodb.com/docs/atlas/app-services/reference/template-apps/#create-a-template-app)

Once you have created the App Services App, replace any value in this client's
`appId` field with your App Services App ID. For help finding this ID, refer
to: [Find Your Project or App Id](https://www.mongodb.com/docs/atlas/app-services/reference/find-your-project-or-app-id/)

### Download the Client as a Zip File

If you have downloaded this client as a .zip file from the Atlas App Services
UI, it does not contain the App Services App ID. You must replace any value 
in this client's `appId` field in `realm-todo-dotnet/realm.json` with your 
App Services App ID. For help finding this ID, refer to: 
[Find Your Project or App Id](https://www.mongodb.com/docs/atlas/app-services/reference/find-your-project-or-app-id/)

## Run the app

- Open `realm-todo-app.sln` in Visual Studio.
- Wait for NuGet to sync dependencies.
- Build & run the app.

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new .

## Changing the Namespace

This app's namespace is `RealmTemplateApp`. You do not need to change it, but if
you choose to, we offer these steps to help you with the process. Note that changing
namespaces in VS solutions can be complicated and error-prone. We do not provide
support for this process.

1. With the Solution open in Visual Studio, in the `Search` menu,
   choose `Replace in Files`.
2. In the **Find** box, enter **RealmTemplateApp**.
3. In the **Replace** box, enter your new namespace name.
4. In the **Look in** drop-down, select **Directories**.
5. In the **Path** box, enter the full path to the root directory of this project.
   Specify the directory that contains the .sln file.
6. Ensure **Recursively** and **Case sensitive** are checked.
7. Click **Replace**.

You should notice the following:

- Approximately 6706 matches were found and replaced.
- Visual Studio will ask you to save changes to any open files. Save
  the changes, but **do not** reload any files from file if you are prompted to do so.

Close the solution, and again answer yes to save changes to each file.

When you reopen the solution, you will see that the namespace has changed;
without any further changes, you should be able to rebuild and run the app.
