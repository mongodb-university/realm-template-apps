#pragma once

#include "managers/auth_manager.hpp"
#include "managers/error_manager.hpp"

struct AppState {
  std::unique_ptr<AuthManager> authManager;
  std::unique_ptr<ErrorManager> errorManager;
};
