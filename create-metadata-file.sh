# Generates a new metadata file (realm.json, atlasConfig.json, etc.) for
# testing You give the command the path to an App Services config
# directory. The directory should correspond to an existing App and
# include the App ID.
#
# Usage: ./create-metadata-file.sh path/to/config/files ./other/web-js/client/src/atlasConfig.json

app_config_directory=$(cd "$(dirname "$1")"; pwd)/$(basename "$1")
metadata_file_path=$(cd "$(dirname "$2")"; pwd)/$(basename "$2")

cd $app_config_directory
app_description=$(npx mongodb-realm-cli app describe | tail -n +2)
APP_ID=$(jq -r '.client_app_id' <<< "$app_description")
REALM_URL=$(jq -r '.realm_url' <<< "$app_description")

DEPLOYMENT_REGEX='https:\/\/(((.+)\.(.+))\.)?services.cloud.mongodb.com'
[[ $REALM_URL =~ $DEPLOYMENT_REGEX ]]
REGION_DOT_CLOUD="${BASH_REMATCH[2]}"
# REGION="${BASH_REMATCH[3]}"
# CLOUD="${BASH_REMATCH[4]}"

CLIENT_API_BASE_URL="${BASH_REMATCH[0]}"
if [[ -z $REGION_DOT_CLOUD ]]; then
  DATA_API_BASE_URL="https://data.mongodb-api.com"
else
  DATA_API_BASE_URL="https://$REGION_DOT_CLOUD.data.mongodb-api.com"
fi

metadata_file=$(
  jq \
    --arg APP_ID "$APP_ID" \
    --arg CLIENT_API_BASE_URL "$CLIENT_API_BASE_URL" \
    --arg DATA_API_BASE_URL "$DATA_API_BASE_URL" \
    '{
      "appId": $APP_ID,
      "baseUrl": "https://services.cloud.mongodb.com",
      "appUrl": .realm_url | split("/") | del(.[] | select(. == "dashboard")) | join("/"),
      "dataSourceName": .data_sources[0].name,
      "clientApiBaseUrl": $CLIENT_API_BASE_URL,
      "dataApiBaseUrl": $DATA_API_BASE_URL
    }' <<< $app_description
)
echo "$metadata_file" > "$metadata_file_path"
