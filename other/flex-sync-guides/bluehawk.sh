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

# function remove_unused_dependencies() {
#   local unused_dependencies=("$@")
#   # This uses jq to update package.json. We don't use `npm uninstall`
#   # because that also installs all the other packages, which takes much
#   # longer and leaves you with a new node_modules folder to clean up.

#   # Construct a jq expression to remove the unused dependencies. The
#   # final expression resemables the following:
#   # jq_expr="del(.dependencies[\"bson\"], .dependencies[\"crypto-browserify\"], .dependencies[\"jwt-decode\"])"
#   local jq_expr=""
#   for dependency in "${unused_dependencies[@]}"; do
#     dep_str=".dependencies[\"$dependency\"]"
#     if [ -z "$jq_expr" ]; then
#       jq_expr=$dep_str
#     else
#       jq_expr="${jq_expr}, ${dep_str}"
#     fi
#   done
#   jq_expr="del(${jq_expr})"

#   jq "$jq_expr" package.json >> package.json.tmp
#   mv package.json.tmp package.json
# }

# function remove_unused_package_json_scripts() {
#   local unused_package_json_scripts=("$@")
#   # Construct a jq expression to remove the unused dependencies. The
#   # final expression resembles the following:
#   # jq_expr="del(.dependencies[\"test:graphql\"], .dependencies[\"test:mql\"], .dependencies[\"test:data-api\"])"
#   local jq_expr=""
#   for script in "${unused_package_json_scripts[@]}"; do
#     dep_str=".scripts[\"$script\"]"
#     if [ -z "$jq_expr" ]; then
#       jq_expr=$dep_str
#     else
#       jq_expr="${jq_expr}, ${dep_str}"
#     fi
#   done
#   jq_expr="del(${jq_expr})"

#   jq "$jq_expr" package.json >> package.json.tmp
#   mv package.json.tmp package.json
# }

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
      unused_dependencies=()
      unused_package_json_scripts=()
      ;;
    "add-collaborators")
      project_name="flex-permissions-template-add-collaborators"
      unused_files=(
        "src/tieredExample.js"
        "src/restrictedFeedExample.js"
      )
      unused_dependencies=()
      unused_package_json_scripts=()
      ;;
    "tiered")
      project_name="flex-permissions-template-tiered"
      unused_files=(
        "src/addCollaboratorsExample.js"
        "src/restrictedFeedExample.js"
      )
      unused_dependencies=()
      unused_package_json_scripts=()
      ;;
    *)
      echo "Unknown state: $state"
      exit 1
      ;;
  esac
  # Run Bluehawk to generate the artifact project for this state
  cd $root_dir
  npx bluehawk copy --state $state -o generated/$state client/;
  # cp template-realm.json generated/$state/src/atlasConfig.json
  # Modify the generated artifact project for things Bluehawk can't do
  cd $output_dir
  rename_project $project_name
  remove_unused_files "${unused_files[@]}"
  # remove_unused_dependencies "${unused_dependencies[@]}"
  # remove_unused_package_json_scripts "${unused_package_json_scripts[@]}"
  npm install --package-lock-only

done

popd
