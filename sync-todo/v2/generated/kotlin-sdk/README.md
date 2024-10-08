# Realm Kotlin SDK Template App

> [!WARNING]
> As of September 2024, Atlas Device SDKs are deprecated. Atlas Device SDKs
> will reach end-of-life and will no longer be maintained by MongoDB on
> September 30, 2025.
>
> The template app in this repository should only be used as a reference for
> the on-device database and not to create a new app based on Device Sync.
> Refer to the [deprecation page](https://www.mongodb.com/docs/atlas/device-sdks/>deprecation/) for details.

## Configuration

Ensure `app/src/main/res/values/atlasConfig.xml` exists and contains the following properties:

- **appId:** your Atlas App Services App ID.
- **baseUrl:** the App Services backend URL. This should be https://services.cloud.mongodb.com in most cases.
- **dataExplorerLink:** the link to the Atlas cluster's collections.

### Using the Atlas App Services UI

The easiest way to use this template app is to log on to [Atlas App Services](https://services.cloud.mongodb.com) and click the **Create App From Template** button. Choose
**Real Time Sync**, and then follow the prompts. While the backend app is being
created, you can download this Kotlin template app pre-configured for your new
app.

### Cloning from GitHub

If you have cloned this repository from the GitHub
[mongodb/template-app-kotlin-todo](https://github.com/mongodb/template-app-kotlin-todo.git)
repository, you must create a separate App Services App with Device Sync
enabled to use this client. You can find information about how to do this
in the Atlas App Services documentation page:
[Template Apps -> Create a Template App](https://www.mongodb.com/docs/atlas/app-services/reference/template-apps/)

Once you have created the App Services App, replace any value in this client's
`realm_app_id` field with your App Services App ID. For help finding this ID, refer
to: [Find Your Project or App Id](https://www.mongodb.com/docs/atlas/app-services/reference/find-your-project-or-app-id/)

### Download the Client as a Zip File

If you have downloaded this client as a .zip file from the Atlas App Services
UI, it does not contain the App Services App ID. You must replace any value
in this client's `realm_app_id` field in `app/src/main/res/values/atlasConfig.xml`
with your App Services App ID. For help finding this ID, refer to:
[Find Your Project or App Id](https://www.mongodb.com/docs/atlas/app-services/reference/find-your-project-or-app-id/)

## Run the app

- Open this directory in Android Studio.
- Wait for gradle to sync dependencies.
- Build & run the app.

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new
