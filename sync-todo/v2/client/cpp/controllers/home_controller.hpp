#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../managers/database_manager.hpp"
#include "../state/app_state.hpp"
#include "../state/database_state.hpp"
#include "../views/scroller.hpp"
#include "../ss.hpp"

class HomeController final : public Controller {
 private:
  AppState *_appState{nullptr};
  std::unique_ptr<DatabaseManager> dbManagerPtr{nullptr};

 public:
  HomeController(AppState *appState);

  void onFrame() override;
};