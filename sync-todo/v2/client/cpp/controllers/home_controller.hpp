#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../app_state.hpp"
#include "../database_state.hpp"
#include "../views/scroller.hpp"
#include "../managers/item_manager.hpp"

class HomeController final : public Controller {
 private:
  AppState *_appState{nullptr};

  struct HomeControllerViewState {
    std::string toggleOfflineModeButtonLabel;
    std::string toggleSubscriptionsButtonLabel;
  } state;

 public:
  HomeController(AppState *appState);

  void onFrame() override;
//  HomeController(AppState *appState): Controller(ftxui::Container::Vertical({
//    ftxui::Button("Log out", [this] {
//      _appState->authManager->logOut(_appState->app.get());
//    }),
//    ftxui::Button("Trigger error", [this] {
//      _appState->errorManager->setError("Uh oh!");
//    })
//  })), _appState(appState) {
//  }
};