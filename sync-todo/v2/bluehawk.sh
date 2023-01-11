#! /bin/bash

V2_APPS=$(git rev-parse --show-toplevel)/sync-todo/v2
FLUTTER_APP=${V2_APPS}/client/flutter

V2_APPS_GEN=${V2_APPS}/generated

echo 'Creating standard template'
bluehawk copy $FLUTTER_APP --output ${V2_APPS_GEN}/flutter-standard-template
bluehawk copy $FLUTTER_APP --output ${V2_APPS_GEN}/flutter-tutorial --state tutorial
