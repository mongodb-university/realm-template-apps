#!/bin/bash -ex

pushd "$(dirname "$0")"

rm -r generated

for state in prod-graphql prod-mql prod-data-api; do
  npx bluehawk copy --state $state -o generated/$state client/;
  cp template-realm.json generated/$state/src/realm.json
done
popd
