# Realm Kotlin SDK Template App

## Configuration

Ensure `app/src/main/res/values/atlasConfig.xml` exists and contains the following properties:

- **realm_app_id:** your Atlas App Services App ID.
- **realm_base_url** the App Services backend URL. This should be https://realm.mongodb.com in most cases.

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
