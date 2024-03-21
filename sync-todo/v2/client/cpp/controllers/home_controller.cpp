#include "home_controller.hpp"

HomeController::HomeController(AppState *appState): Controller(ftxui::Container::Vertical({
  ftxui::Button("Log out", [this] {
    _appState->authManager->logOut(_appState->app.get());
  }),
  ftxui::Button("Trigger error", [this] {
    _appState->errorManager->setError("Uh oh!");
  })
  })), _appState(appState) {
}