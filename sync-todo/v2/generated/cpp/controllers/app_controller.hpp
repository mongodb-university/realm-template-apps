#ifndef APP_CONTROLLER_HPP
#define APP_CONTROLLER_HPP

#include <nlohmann/json.hpp>
#include <cpprealm/sdk.hpp>
#include <fstream>

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "home_controller.hpp"
#include "login_controller.hpp"
#include "navigation.hpp"
#include "../managers/auth_manager.hpp"
#include "../managers/error_manager.hpp"
#include "../state/app_config_metadata.hpp"
#include "../state/app_state.hpp"
#include "../state/home_controller_state.hpp"
#include "../ss.hpp"

class AppController final : public Controller, public AuthManager::Delegate, public ErrorManager::Delegate {
 private:
  AppState _appState;
  Navigation _navigation;
  ftxui::Component _errorModal;

 public:
  explicit AppController(ftxui::ScreenInteractive *screen, std::string const& pathToAtlasConfig);

  void onFrame() override;

 private:
  void onLoggedIn() override;

  void onLoggedOut() override;

  void onError(ErrorManager &error) override;

  void onErrorCleared(ErrorManager &error) override;
};

#endif
