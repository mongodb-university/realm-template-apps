# iOS Swift Template App

This project uses Swift Package Manager (SPM) to load dependencies.

⚠️ There is a [known issue](https://developer.apple.com/documentation/xcode-release-notes/xcode-13_2-release-notes) with SPM on Xcode 13.2:

>If you’re using Swift packages either standalone or as dependencies in an Xcode project or workspace, the Mac App Store version of Xcode fails during package resolution with the error “Internal error: missingPackageDescriptionModule.” (86435800)
>Workaround: Download Xcode 13.2 directly from the [Apple Developer website](https://developer.apple.com/download/all/?q=Xcode%2013.2).

## Configuration

Ensure App/Realm.plist exists and contains the following properties:

- **appId:** your Realm app ID, which can be found in the Realm app UI at https://realm.mongodb.com
- **baseUrl:** the Realm backend URL. Should be https://realm.mongodb.com in most cases.

## Run the app

- Open App.xcodeproj in Xcode.
- Wait for SPM to download dependencies.
- Press "Run".

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new

