#! /bin/bash

V2_APPS=$(git rev-parse --show-toplevel)/sync-todo/v2
V2_APPS_GEN=${V2_APPS}/generated
FLUTTER_APP=${V2_APPS}/client/flutter

# Delete currently generated apps
rm -rf V2_APPS_GEN

echo 'Creating standard Flutter template app'
bluehawk copy $FLUTTER_APP --output ${V2_APPS_GEN}/flutter-standard-template
echo 'Creating tutorial annotated Flutter template app'
bluehawk copy $FLUTTER_APP --output ${V2_APPS_GEN}/flutter-tutorial --state tutorial

cp ${V2_APPS}/template-realm.json ${V2_APPS_GEN}/flutter-standard-template/assets/config/realm.json
cp ${V2_APPS}/template-realm.json ${V2_APPS_GEN}/flutter-tutorial/assets/config/realm.json
