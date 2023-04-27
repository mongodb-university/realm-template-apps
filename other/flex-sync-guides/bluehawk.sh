#!/bin/bash -ex

pushd "$(dirname "$0")"
states=("restricted-feed" "add-collaborators" "tiered")
root_dir=$PWD

function rename_project() {
  local project_name=$1
  jq ".name = \"$project_name\"" package.json >> package.json.tmp
  mv package.json.tmp package.json
}

function remove_unused_files() {
  local unused_files=("$@")
  for filepath in "${unused_files[@]}"; do
    rm $filepath
  done
}

if [ -d "generated" ]; then
  rm -r generated
fi

for state in ${states[@]}; do
  # Set up variables for this state
  output_dir="generated/$state"
  case "$state" in
    "restricted-feed")
      project_name="flex-permissions-template-restricted-feed"
      unused_files=(
        "src/addCollaboratorsExample.js"
        "src/tieredExample.js"
      )
      ;;
    "add-collaborators")
      project_name="flex-permissions-template-add-collaborators"
      unused_files=(
        "src/tieredExample.js"
        "src/restrictedFeedExample.js"
      )
      ;;
    "tiered")
      project_name="flex-permissions-template-tiered"
      unused_files=(
        "src/addCollaboratorsExample.js"
        "src/restrictedFeedExample.js"
      )
      ;;
    *)
      echo "Unknown state: $state"
      exit 1
      ;;
  esac
  # Run Bluehawk to generate the artifact project for this state
  cd $root_dir
  npx bluehawk copy --state $state -o generated/$state client/;
  cp template-realm.json generated/$state/src/realm.json
  # Modify the generated artifact project for things Bluehawk can't do
  cd $output_dir
  rename_project $project_name
  remove_unused_files "${unused_files[@]}"
  npm install --package-lock-only

done

popd
