#!/bin/bash -ex

pushd "$(dirname "$0")"

rm -r generated

for client in client/*; do
  # Can't Bluehawk copy the cpp client because of `:state:` in the code
  # Can remove if block when this issue is resolved: https://github.com/mongodb-university/Bluehawk/issues/145
  if [[ "$client" != "client/cpp"* ]]; then
  npx bluehawk copy -o generated/$(basename $client) $client/;
  fi
done

cp template-atlasConfig.json generated/flutter/assets/config/atlasConfig.json
cp template-atlasConfig.json generated/react-native/atlasConfig.json
cp template-atlasConfig.plist generated/swiftui/App/atlasConfig.plist
cp template-atlasConfig.xml generated/kotlin-sdk/app/src/main/res/values/atlasConfig.xml
cp template-atlasConfig.json generated/maui/RealmTodo/atlasConfig.json

popd
