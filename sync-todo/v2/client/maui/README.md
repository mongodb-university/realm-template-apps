# Maui C# Template App

## Configuration

The App ID is located in `RealmTodo/Services/RealmService.cs`:

```cs
namespace RealmTodo.Services
{
    public static class RealmService
    {
        private const string appId = "****";
        ...
    }
    ...
}
```

Replace this string `appId` value with your App Services App ID. For help
finding this ID, refer to:
[Find Your Project or App Id](https://www.mongodb.com/docs/atlas/app-services/reference/find-your-project-or-app-id/)

### Cloning from GitHub

If you have cloned this repository from the GitHub
[mongodb/template-app-xamarin-todo](https://github.com/mongodb/template-app-xamarin-todo.git)
repository, you must create a separate App Services App with Device Sync
enabled to use this client. You can find information about how to do this
in the Atlas App Services documentation page:
[Template Apps -> Create a Template App](https://www.mongodb.com/docs/atlas/app-services/reference/template-apps/)

Once you have created the App Services App, update the `appId` per the
above instructions.

### Download the Client as a Zip File

If you have downloaded this client as a .zip file from the Atlas App Services
UI, it does not contain the App Services App ID. You must replace any value
in this client's `appId` field in `RealmTodo/Services/RealmService.cs` with your
App Services App ID. For help finding this ID, refer to:
[Find Your Project or App Id](https://www.mongodb.com/docs/atlas/app-services/reference/find-your-project-or-app-id/)

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new .
