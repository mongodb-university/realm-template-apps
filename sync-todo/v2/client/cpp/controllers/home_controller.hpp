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
  std::unique_ptr<DatabaseManager> _databaseManager;
//  std::shared_ptr<HomeScreenButtonRowBase> *homeScreenButtonRow{nullptr};
//  HomeScreenButtonRowState buttonRowState;

  struct HomeControllerViewState {
    std::string toggleOfflineModeButtonLabel;
    std::string toggleSubscriptionsButtonLabel;
  } state;

 public:
  HomeController(AppState *appState);

  void onFrame() override;
};