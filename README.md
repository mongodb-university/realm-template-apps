# realm-template-apps

This is the main repo for all MongoDB App Services & Realm template starter app
clients and backend configurations.

A GitHub Action uploads to the realm-template-apps S3 bucket. See [.github/workflows/zip-everything-and-upload-to-s3.yml](.github/workflows/zip-everything-and-upload-to-s3.yml).

For bucket access, consult the Realm docs team.

## Artifact Repos

A GitHub Action creates "artifact repos" of a few subdirectories so that the client code can be examined and cloned easily.

- https://github.com/mongodb/template-app-dart-flutter-todo
- https://github.com/mongodb/template-app-kotlin-todo
- https://github.com/mongodb/template-app-react-native-todo
- https://github.com/mongodb/template-app-swiftui-todo
- https://github.com/mongodb/template-app-xamarin-todo

## About "generated"

⚠️ If the path contains `/generated/`, don't edit it directly! This is generated
from another source, probably using
[Bluehawk](https://github.com/mongodb-university/bluehawk).

## Adding a New Template App

1. Add your project in its own subdirectory. If you are basing your project off
   of an existing project (for example, creating a Flexible-Sync version of a
   partition-based app), consider using the Bluehawk `state` tags and using
   Bluehawk to copy each app to its own subdirectory within the
   `generated` directory.

2. Be sure your project uses a `realm.json` file to get the app id and
   base url info:

   ```
   {
      "appId": "todo-sync-jxgjv",
      "baseUrl": "https://realm.mongodb.com"
   }
   ```

   Note that these values will be updated by the script that links the
   Realm UI to each template app. The location of this file should make sense
   to your app (and its users) -- you just need to let the build trigger know
   where it is, which you do in the next step.

3. Update the manifest.json file that lives in the root of this repo to add a
   new object to the manifest. Each object has this shape:

   ```
   "<my.project.id>": { <-- change to your unique ID
    "name": "The.Title.Of.My.App",
    "repo_owner": "mongodb-university", <-- don't change
    "repo_name": "realm-template-apps", <-- don't change
    "backend_path": "see the notes below",
    "client_path": "my-project-subdirectory-name",
    "metadata_path": "path-to-the-directory-that-contains-your-realm.json-file",
    "metadata_filename": "realm",
    "file_format": "json"
   },

   ```

   Each key in the manifest is the unique ID of the template. No spaces are
   allowed. Should ideally be somewhat typeable as users have the option of
   manually pulling templates via the realm-cli (i.e. realm-cli pull
   --template=some-template-id)

   - **name:** A friendly name. Presented in the UI or when listing available
     templates from the CLI.
   - **repo_owner, repo_name:** This repo's upstream. Just use mongodb-university
     and realm-template-apps respectively.
   - **backend_path:** The relative path from the root of this repo to the backend
     app to import when instantiating the template.
   - **client_path:** (optional). The relative path from the root of this repo to
     the client app source directory to be copied when instantiating the
     template.

   metadata_path, metadata_filename, and file_format are all required if
   client_path set. When Realm instantiates the template, it adds the generated
   backend app ID (and base URL) to a file that the instantiated client then reads
   to know which backend app to use.

   - **metadata_path:** The relative path from the root of this repo to the
     directory where your client reads the Realm metadata file.
   - **metadata_filename:** The actual name of the Realm metadata file. Probably
     "Realm" or "realm".
   - **file_format:** One of "json", "xml", or "plist" -- whichever your client
     knows how to read. Realm produces a metadata file with the given
     file_format as file extension in the format specified.

4. When you merge your branch, a Github action zips everything up and uploads to
   an s3 bucket. Upon the next reload of App Services (usually around release
   time but can be requested any time), App Services pulls the zip file down and
   makes the templates within available to the CLI.

   The product team decides which templates actually show up in the UI.

   In short: when you merge your changes to the repo, the UI will _not_ expose
   this template immediately. You _should_ be safe to work on this template at
   your leisure. However, people can create apps with this template via the
   `cli` soon after you merge.
