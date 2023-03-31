# Generate a new realm.json file

# Usage: ./create-metadata-file.sh app-backend ./other/web-js/client/src/atlasConfig.json

pushd "$(dirname "$0")"

app_config_directory=$(cd "$(dirname "$1")"; pwd)/$(basename "$1")
metadata_file_path=$(cd "$(dirname "$2")"; pwd)/$(basename "$2")

cd $app_config_directory
npx mongodb-realm-cli app describe | tail -n +2 >> app_description.json
APP_ID=$(jq -r '.client_app_id' app_description.json)
jq --arg APP_ID $APP_ID '{
  "appId": $APP_ID,
  "baseUrl": "https://realm.mongodb.com",
  "appUrl": .realm_url | split("/") | del(.[] | select(. == "dashboard")) | join("/"),
  "dataSourceName": .data_sources[0].name,
  "clientApiBaseUrl": (.graphql.url | split("/") | del( .[] | select(. | IN("app", $APP_ID, "graphql") )) | join("/") + "/"),
  "dataApiBaseUrl": ("https://data.mongodb-api.com/app/" + $APP_ID + "/endpoint/data/v1/")
}' app_description.json >> "$metadata_file_path"
rm app_description.json

popd
