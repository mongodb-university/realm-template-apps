#!/bin/bash -ex

pushd "$(dirname "$0")"

rm -r generated

for client in client/*; do
  npx bluehawk copy -o generated/$(basename $client) $client/;
done

cp template-realm.json generated/flutter/assets/config/realm.json
cp template-realm.json generated/react-native/realm.json
cp template-realm.plist generated/swiftui/App/Realm.plist
cp template-realm.xml generated/kotlin-sdk/app/src/main/res/values/realm.xml
# cp template-realm.json generated/maui/realm-todo-dotnet/realm.json

popd
