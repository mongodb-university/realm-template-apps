#ifndef APP_STATE_HPP
#define APP_STATE_HPP

#include "../managers/auth_manager.hpp"
#include "../managers/error_manager.hpp"
#include "app_config_metadata.hpp"

#include "ftxui/component/screen_interactive.hpp"

struct AppState {
  std::unique_ptr<realm::App> app;
  std::unique_ptr<AuthManager> authManager;
  std::unique_ptr<ErrorManager> errorManager;
  AppConfigMetadata appConfigMetadata;

  ftxui::ScreenInteractive *screen;
};

#endif
