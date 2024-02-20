#include <cpprealm/sdk.hpp>

#include "./data/auth-manager.hpp"
#include "./screens/authentication.hpp"
#include "./screens/dashboard.hpp"
#include "./screens/static-dashboard.hpp"

// Authentication g_authentication;
Dashboard g_dashboard;
StaticDashboard g_static_dashboard;
Authentication g_authentication;

auto APP_ID = "INSERT-YOUR-APP-ID-HERE";

int main() {
  auto appConfig = realm::App::configuration();
  appConfig.app_id = APP_ID;
  auto app = std::make_shared<realm::App>(appConfig);
  std::shared_ptr<AuthManager> g_auth_manager =
      std::make_shared<AuthManager>(app);

  // Authentication
  g_authentication.init(g_auth_manager);

  // Interactive dashboard
  // g_dashboard.init();

  // Static mockup dashboard
  // g_static_dashboard.init();
  return 0;
}
