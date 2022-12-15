# Xamarin C# Template App

## Configuration

Ensure realm-todo-dotnet/realm.json exists and contains the following properties:

- **appId:** your Realm app ID, which can be found in the Realm app UI at https://realm.mongodb.com
- **baseUrl:** the Realm backend URL. Should be https://realm.mongodb.com in most cases.

## Run the app

- Open `realm-todo-app.sln` in Visual Studio.
- Wait for NuGet to sync dependencies.
- Build & run the app.

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new

## Changing the Namespace

This app's namespace is ``RealmTemplateApp``. You do not need to change it, but if
you choose to, we offer these steps to help you with the process. Note that changing
namespaces in VS solutions can be complicated and error-prone. We do not provide
support for this process.

1. With the Solution open in Visual Studio, in the ``Search`` menu,
   choose ``Replace in Files``.
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
