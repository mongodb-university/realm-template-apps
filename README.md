# realm-template-apps

A GitHub action uploads to the realm-template-apps s3 bucket. See [.github/workflows/zip-everything-and-upload-to-s3.yml](.github/workflows/zip-everything-and-upload-to-s3.yml).
For bucket access, consult the Realm docs team.

## Adding a New Template App

1. Add your project in its own subdirectory.
   If you are basing your project off of
   an existing project (for example, creating a Flexible-Sync version of a
   partition-based app), consider using the Bluehawk `state` tags and using
   Bluehawk to copy each app to its own subdirectory within the `/generated`
   directory.

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

3. Update the manifest.json file that lives in the root of this repo.

   ```
   "my.project.id": {
    "name": "The.Title.Of.My.App",
    "repo_owner": "mongodb-university", <-- don't change
    "repo_name": "realm-template-apps", <-- don't change
    "backend_path": "see the notes below",
    "client_path": "my-project-subdirectory-name",
    "metadata_path": "path-to-the-directory-that-contains-your-realm.json-file",
    "metadata_filename": "realm", <-- don't change
    "file_format": "json" <-- don't change
   },

   ```

   ### NOTES

   - The project id that you choose for the new template app can be anything you
     want, but should ideally be somewhat typeable as users have the option of
     manually pulling templates via the realm-cli
     (ie: realm-cli pull --template=<templateId>)

   - The `client-path` field points to the location in this repo where the Realm
     backend app is defined. Many of the projects share the same backend app
     (either todo-sync or todo-nonsync), while some require their own
     this author knows not why).

4. Coordinate with the product team about how they want the template app to be
   shown in the UI.

5. When you merge your branch, a Github action does the magic. Note the following:

   "When you merge your changes to the repo, the UI will _not_ expose this template
   immediately, so you _should_ be safe to work on this template at your leisure.
   However, people can create apps with this template via the `cli` once you merge."
