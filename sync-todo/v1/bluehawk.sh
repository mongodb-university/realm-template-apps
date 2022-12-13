#!/bin/bash -ex
pushd "$(dirname "$0")"
for client in client/*; do
  npx bluehawk copy -o generated/$(basename $client) $client/;
done
popd
