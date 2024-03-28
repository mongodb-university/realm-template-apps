#ifndef APP_CONFIG_METADATA_HPP
#define APP_CONFIG_METADATA_HPP

#include <string>
#include "nlohmann/json.hpp"

struct AppConfigMetadata {
  std::string appId;
  std::string appUrl;
  std::string baseUrl;
  std::string clientApiBaseUrl;
  std::string dataApiBaseUrl;
  std::string dataExplorerLink;
  std::string dataSourceName;
};

void to_json(nlohmann::json& j, const AppConfigMetadata& appConfigMetadata);
void from_json(const nlohmann::json& j, AppConfigMetadata& appConfigMetadata);

#endif
