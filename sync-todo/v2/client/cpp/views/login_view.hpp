#pragma once

#include <cpprealm/sdk.hpp>

#include "ftxui/component/captured_mouse.hpp"
#include "ftxui/component/component.hpp"
#include "ftxui/dom/elements.hpp"

#include "../controllers/login_controller.hpp"

class LoginView {
 private:
  std::string email;
  std::string password;
  ftxui::Component inputEmail;
  ftxui::InputOption inputOptionForPassword;
  ftxui::Component inputPassword;
  std::string loginButtonLabel;
  std::function<void()> onLoginButtonClick;
  ftxui::Component loginButton;
  std::string registerButtonLabel;
  std::function<void()> onRegisterButtonClick;
  ftxui::Component registerButton;
  ftxui::Component buttonLayout;
  ftxui::Component screenLayout;
 public:
  ftxui::Component init(LoginController* _loginController);
};