# React Native Template App

## Configuration

Ensure ./realm.json exists and contains the following properties:

- **appId:** your Realm app ID, which can be found in the Realm app UI at https://realm.mongodb.com
- **baseUrl:** the Realm backend URL. Should be https://realm.mongodb.com in most cases.

## How to Run the Application for Mac Users:
- make sure you are in this directory
- `npm install`
- `cd ios && pod install --repo-update && cd ..`
- `npx react-native run-ios` (or `npx react-native run-android`, if you have an emulator running. Note: If you have not set up your development environment for running react-native android apps, see: https://reactnative.dev/docs/environment-setup)

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new
