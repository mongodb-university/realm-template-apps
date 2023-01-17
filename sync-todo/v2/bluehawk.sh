#!/bin/bash -ex

pushd "$(dirname "$0")"

rm -r generated

for client in client/*; do
  npx bluehawk copy -o generated/$(basename $client) $client/;
done

cp template-atlasConfig.json generated/flutter/assets/config/atlasConfig.json
cp template-atlasConfig.json generated/react-native/atlasConfig.json
cp template-atlasConfig.plist generated/swiftui/App/atlasConfig.plist
cp template-atlasConfig.xml generated/kotlin-sdk/app/src/main/res/values/atlasConfig.xml
cp template-atlasConfig.json generated/maui/RealmTodo/atlasConfig.json

popd
