#!/bin/bash -ex
for state in restricted-feed add-collaborators tiered; do bluehawk copy --state $state -o generated/$state client/; done

