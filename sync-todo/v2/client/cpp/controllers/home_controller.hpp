#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../app_state.hpp"
#include "../database_state.hpp"
#include "../views/scroller.hpp"
#include "../managers/database_manager.hpp"
//#include "../state/home_screen_button_state.hpp"
//#include "../views/home_screen_button_row.hpp"

class HomeController final : public Controller {
 private:
  AppState *_appState{nullptr};
  std::unique_ptr<DatabaseManager> dbManagerPtr{nullptr};

 public:
  HomeController(AppState *appState);

  void onFrame() override;
};