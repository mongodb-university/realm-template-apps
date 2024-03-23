#pragma once

#include "../managers/auth_manager.hpp"
#include "../managers/error_manager.hpp"
#include "database_state.hpp"
#include "app_config_metadata.hpp"

#include "ftxui/component/screen_interactive.hpp"

struct AppState {
  std::unique_ptr<AuthManager> authManager;
  std::unique_ptr<ErrorManager> errorManager;
  std::unique_ptr<AppConfigMetadata> appConfigMetadata;
  std::unique_ptr<realm::App> app;
  std::unique_ptr<DatabaseState> databaseState;

  ftxui::ScreenInteractive *screen;
};
