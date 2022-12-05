# React Native Template App

## Prerequisites
- Make sure your system is setup to run a React Native application by following the [setup guide](https://reactnative.dev/docs/environment-setup)
- Set up an Atlas account and [deploy a cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
- Set up an application in App Services.
    -  You can use the [`realm-cli`](https://www.mongodb.com/docs/atlas/app-services/cli/) to set up the backend and download a copy of this template:
		```
		realm-cli apps create -n "<App Name>" --template "react-native-ts.todo.flex"
		```

## Configuration

Ensure ./realm.json exists and contains the following properties:

- **appId:** your Realm app ID, which can be found in the Realm app UI at https://realm.mongodb.com
- **baseUrl:** the Realm backend URL. Should be https://realm.mongodb.com in most cases.

## How to Run the Application:
- Make sure you are in this directory
- `npm install`
- `npx pod-install` if on Mac
- `npm run ios` (or `npm run android`, if you have an emulator running. Note: If you have not set up your development environment for running react-native android apps, see: https://reactnative.dev/docs/environment-setup)

## Issues

Please report issues with the template at https://github.com/mongodb-university/realm-template-apps/issues/new
