#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../app_state.hpp"
#include "../database_state.hpp"
#include "../views/scroller.hpp"
#include "../managers/database_manager.hpp"

class HomeController final : public Controller {
 private:
  AppState *_appState{nullptr};
  std::unique_ptr<DatabaseManager> dbManagerPtr{nullptr};

 public:
  HomeController(AppState *appState);

  void onFrame() override;
};