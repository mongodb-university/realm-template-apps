#!/bin/bash -ex
pushd "$(dirname "$0")"
for state in prod-mql prod-graphql; do
  bluehawk copy --state $state -o generated/$state client/;
done
popd
