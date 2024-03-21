#include "app_controller.hpp"

void AppController::onFrame() {
  _navigation.onFrame();
}

//AppController::AppController() {
//
//  _appState.authManager = std::make_unique<AuthManager>(this);
//  _appState.errorManager = std::make_unique<ErrorManager>(this);
//
//  _errorModal = ftxui::Container::Vertical({
//    ftxui::Renderer([this] {
//      return ftxui::text(_appState.errorManager->getError().value());
//    }),
//    ftxui::Button("Dismiss", [=] {
//      _appState.errorManager->clearError();
//    }),
//    });
//
//  component()->Add(_navigation.component());
//
//  if (isUserLoggedIn) {
//    _navigation.goTo(std::make_unique<HomeController>(&_appState));
//  } else {
//    _navigation.goTo(std::make_unique<LoginController>(&_appState));
//  }
//}

//void AppController::onLoggedIn() override {
//  _navigation.goTo(std::make_unique<HomeController>(&_appState));
//}
//
//void AppController::onLoggedOut() override {
//  _navigation.goTo(std::make_unique<LoginController>(&_appState));
//}
//
//void AppController::onError(ErrorManager &error) override {
//  _errorModal->Detach();
//  component()->Add(_errorModal);
//  _errorModal->TakeFocus();
//}
//
//void AppController::onErrorCleared(ErrorManager &error) override {
//  _errorModal->Detach();
//}