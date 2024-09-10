# Maui C# Template App

A todo list application built with the [.NET SDK](https://www.mongodb.com/docs/realm/sdk/dotnet/) and [Atlas Device Sync](https://www.mongodb.com/docs/atlas/app-services/sync/).

You can follow along with the [MAUI Tutorial](https://www.mongodb.com/docs/atlas/app-services/tutorial/dotnet/) to see how to build, modify, and
run this template app.

> [!WARNING]
> As of September 2024, Atlas Device SDKs are deprecated. Atlas Device SDKs
> will reach end-of-life and will no longer be maintained by MongoDB on
> September 30, 2025.
>
> The template app in this repository should only be used as a reference for
> the on-device database and not to create a new app based on Device Sync.
> Refer to the [deprecation page](https://www.mongodb.com/docs/atlas/device-sdks/>deprecation/) for details.

## Configuration

The App ID is located in `atlasConfig.json`:

```json
{
  "appId": "********",
  "baseUrl": "https://services.cloud.mongodb.com"
}
```

You will need to change the value of `appId` value with your App Services App ID. For help finding this ID, refer to: [Find Your Project or App Id](https://www.mongodb.com/docs/atlas/app-services/reference/find-your-project-or-app-id/)

### Using the Atlas App Services UI

The easiest way to use this template app is to log on to [Atlas App Services](https://services.cloud.mongodb.com) and click the **Create App From Template** button. Choose
**Real Time Sync**, and then follow the prompts. While the backend app is being
created, you can download this MAUI template app pre-configured for your new
app.

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
UI, the App ID should have been automatically set in the `atlasConfig.json` file,
so there is no need to set it manually.

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new .
