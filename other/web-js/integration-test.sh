# usage:
# $ ATLAS_PUBLIC_API_KEY="abcdefgh"
# $ ATLAS_PRIVATE_API_KEY="11111111-0ff0-1337-h4c2-f00b470ec112"
# $ ./integration-test.sh \
#     -d ./backend-data-api \
#     -t ./test-backend-data-api \
#     -s prod-data-api \
#     -c Cluster0

while getopts "d:t:s:c:" arg; do
  case $arg in
    d) backend_dir=$OPTARG;;
    t) test_backend_dir=$OPTARG;;
    s) state=$OPTARG;;
    c) cluster_name=$OPTARG;;
  esac
done

if [ -z "$ATLAS_PUBLIC_API_KEY" ]; then
  echo "You must specify your Atlas Public API Key as the env variable ATLAS_PUBLIC_API_KEY"
  exit 1
fi

if [ -z "$ATLAS_PRIVATE_API_KEY" ]; then
  echo "You must specify your Atlas Private API Key as the env variable ATLAS_PRIVATE_API_KEY"
  exit 1
fi

if [ -z "$backend_dir" ]; then
  echo "You must specify the App's config directory with -d"
  exit 1
fi

if [ -z "$test_backend_dir" ]; then
  echo "You must specify the test App's config directory with -t"
  exit 1
fi

if [ -z "$state" ]; then
  echo "You must specify the state with -s"
  exit 1
fi

if [ -z "$cluster_name" ]; then
  echo "You must specify the cluster name with -c"
  exit 1
fi

PROJECT_ROOT=${PWD}
REPO_ROOT=${PWD%/*/*}

npx mongodb-realm-cli login --api-key="$ATLAS_PUBLIC_API_KEY" --private-api-key="$ATLAS_PRIVATE_API_KEY"
npx mongodb-realm-cli whoami

# Create a new copy of the config files
cp -r $backend_dir $test_backend_dir
cd $test_backend_dir

# Overwrite default config values
## { "name": "template-web-mql" } -> { "name": "template-web-mql-test" }
jq '.name = .name + "-test"' realm_config.json > realm_config.tmp.json
mv realm_config.tmp.json realm_config.json
## { "config": { "clusterName": "Cluster0" } } -> { "config": { "clusterName": "SomeCluster" } }
jq --arg cluster_name "$cluster_name" '.config.clusterName = $cluster_name' data_sources/mongodb-atlas/config.json > data_sources/mongodb-atlas/config.tmp.json
mv data_sources/mongodb-atlas/config.tmp.json data_sources/mongodb-atlas/config.json
# Create the test App
app_id=$(jq ".app_id" realm_config.json)
npx mongodb-realm-cli push -y --remote "$app_id"

bash "$REPO_ROOT/create-metadata-file.sh" "$PROJECT_ROOT/$test_backend_dir" "$PROJECT_ROOT/generated/$state/src/atlasConfig.json"
echo "$PROJECT_ROOT/generated/$state/src/atlasConfig.json"
jq "." "$PROJECT_ROOT/generated/$state/src/atlasConfig.json"

# Run the tests
cd "$PROJECT_ROOT/generated/$state"
npm install
npm run test


# Clean up
echo "cleaning up"
cd "$PROJECT_ROOT/$test_backend_dir"
app_id=$(jq ".app_id" realm_config.json)
npx mongodb-realm-cli app delete -y --app "$app_id"
cd ..
rm -rf "$test_backend_dir"
