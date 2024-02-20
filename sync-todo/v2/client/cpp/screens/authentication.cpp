#include "authentication.hpp"

#include <string>

#include "ftxui/component/captured_mouse.hpp"  // for ftxui
#include "ftxui/component/component.hpp"       // for Input, Renderer, Vertical
#include "ftxui/component/component_base.hpp"  // for ComponentBase
#include "ftxui/component/component_options.hpp"  // for InputOption
#include "ftxui/component/screen_interactive.hpp"  // for Component, ScreenInteractive
#include "ftxui/dom/elements.hpp"  // for text, hbox, separator, Element, operator|, vbox, border
#include "ftxui/util/ref.hpp"  // for Ref

using namespace ftxui;

void Authentication::init(std::shared_ptr<AuthManager> _authManager) {
  auto screen = ScreenInteractive::FitComponent();

  std::string email;
  std::string password;

  Component inputEmail = Input(&email, "Email");
  InputOption password_option;
  password_option.password = true;
  Component inputPassword = Input(&password, "password", password_option);

  std::string loginButtonLabel = "Login";
  std::function<void()> onLoginButtonClick = [&] {;
      _authManager->loginUser(email, password); };
  auto loginButton = Button(&loginButtonLabel, onLoginButtonClick);

  std::string registerButtonLabel = "Register";
  std::function<void()> onRegisterButtonClick = [&] {;
      _authManager->registerAndLoginUser(email, password);};
  auto registerButton = Button(&registerButtonLabel, onRegisterButtonClick);

  auto buttonLayout = Container::Horizontal({loginButton, registerButton});

  auto screenLayout = Container::Vertical(
      {inputEmail, inputPassword, buttonLayout});

  auto renderer = Renderer(screenLayout, [&] {
    return vbox({
               hbox(text(" Atlas Device SDK C++ Todo ") | hcenter),
               separator(),
               hbox(text(" Email : "), inputEmail->Render()),
               hbox(text(" Password   : "), inputPassword->Render()),
               separator(),
               hbox({
                   filler(),
                   loginButton->Render(),
                   registerButton->Render(),
                   filler(),
               }),
               separator(),
               hbox(text("Please log in or register with a Device Sync user "
                         "account. ") |
                    hcenter),
               hbox(text("This is separate from your Atlas Cloud login.") |
                    hcenter),
           }) |
           xflex | size(WIDTH, GREATER_THAN, 60) | border;
  });

  screen.Loop(renderer);
}