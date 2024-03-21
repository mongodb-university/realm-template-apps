#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "navigation.hpp"
#include "../managers/auth_manager.hpp"
#include "../managers/error_manager.hpp"
#include "../app_state.hpp"
#include "home_controller.hpp"
#include "login_controller.hpp"

class AppController final : public Controller, public AuthManager::Delegate, public ErrorManager::Delegate {
 private:
  AppState _appState;
  Navigation _navigation;

  bool _showErrorModal{true};
  bool isUserLoggedIn{false};
  ftxui::Component _errorModal;

 public:
//  AppController();
  AppController() {

    _appState.authManager = std::make_unique<AuthManager>(this);
    _appState.errorManager = std::make_unique<ErrorManager>(this);

    _errorModal = ftxui::Container::Vertical({
      ftxui::Renderer([this] {
        return ftxui::text(_appState.errorManager->getError().value());
      }),
      ftxui::Button("Dismiss", [=] {
        _appState.errorManager->clearError();
      }),
      });

    component()->Add(_navigation.component());

    if (isUserLoggedIn) {
      _navigation.goTo(std::make_unique<HomeController>(&_appState));
    } else {
      _navigation.goTo(std::make_unique<LoginController>(&_appState));
    }
  }

 private:
  void onLoggedIn() override {
    _navigation.goTo(std::make_unique<HomeController>(&_appState));
  }

  void onLoggedOut() override {
    _navigation.goTo(std::make_unique<LoginController>(&_appState));
  }

  void onError(ErrorManager &error) override {
    _errorModal->Detach();
    component()->Add(_errorModal);
    _errorModal->TakeFocus();
  }

  void onErrorCleared(ErrorManager &error) override {
    _errorModal->Detach();
  }
};