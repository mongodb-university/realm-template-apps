#ifndef LOGIN_CONTROLLER_HPP
#define LOGIN_CONTROLLER_HPP

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../state/app_state.hpp"

class LoginController final : public Controller {
 private:
  AppState *_appState{nullptr};

  struct LoginViewState {
    std::string userEmail;
    std::string userPassword;
  } state;

 public:
  explicit LoginController(AppState *appState);
};

#endif
