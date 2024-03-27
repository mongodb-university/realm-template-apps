#include "app_config_metadata.hpp"

void to_json(nlohmann::json& j, const AppConfigMetadata& appConfigMetadata) {
  j = nlohmann::json{
      {"appId",               appConfigMetadata.appId},
      {"appUrl",              appConfigMetadata.appUrl},
      {"baseUrl",             appConfigMetadata.baseUrl},
      {"clientApiBaseUrl",    appConfigMetadata.clientApiBaseUrl},
      {"dataApiBaseUrl",      appConfigMetadata.dataApiBaseUrl},
      {"dataExplorerLink",    appConfigMetadata.dataExplorerLink},
      {"dataSourceName",      appConfigMetadata.dataSourceName}
  };
}

void from_json(const nlohmann::json& j, AppConfigMetadata& appConfigMetadata) {
  j.at("appId").get_to(appConfigMetadata.appId);
  j.at("appUrl").get_to(appConfigMetadata.appUrl);
  j.at("baseUrl").get_to(appConfigMetadata.baseUrl);
  j.at("clientApiBaseUrl").get_to(appConfigMetadata.clientApiBaseUrl);
  j.at("dataApiBaseUrl").get_to(appConfigMetadata.dataApiBaseUrl);
  j.at("dataExplorerLink").get_to(appConfigMetadata.dataExplorerLink);
  j.at("dataSourceName").get_to(appConfigMetadata.dataSourceName);
}