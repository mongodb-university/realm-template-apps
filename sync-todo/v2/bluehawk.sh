#!/bin/bash -ex

pushd "$(dirname "$0")"

for client in client/*; do
  rm -r generated/$(basename $client)
  npx bluehawk copy -o generated/$(basename $client) $client/;
done

cp template-cpp-atlasConfig.json generated/cpp/atlasConfig.json
cp template-atlasConfig.json generated/flutter/assets/config/atlasConfig.json
cp template-atlasConfig.json generated/react-native/atlasConfig.json
cp template-atlasConfig.plist generated/swiftui/App/atlasConfig.plist
cp template-atlasConfig.xml generated/kotlin-sdk/app/src/main/res/values/atlasConfig.xml
cp template-atlasConfig.json generated/maui/RealmTodo/atlasConfig.json

popd
