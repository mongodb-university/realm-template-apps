#!/bin/bash -ex
pushd "$(dirname "$0")"
for state in restricted-feed add-collaborators tiered; do
  npx bluehawk copy --state $state -o generated/$state client/;
done
popd
