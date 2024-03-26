#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../managers/database_manager.hpp"
#include "../state/app_state.hpp"
#include "../state/home_controller_state.hpp"
#include "../views/scroller.hpp"
#include "../ss.hpp"

class HomeController final : public Controller {
 private:
  AppState *_appState{nullptr};
  HomeControllerState *_homeControllerState;
  std::unique_ptr<DatabaseManager> _dbManager{nullptr};

 public:
  HomeController(AppState *appState);

  void onFrame() override;
};