#pragma once

#include <cpprealm/sdk.hpp>
#include "ftxui/component/captured_mouse.hpp"  // for ftxui
#include "ftxui/component/component.hpp"       // for Input, Renderer, Vertical
#include "ftxui/component/screen_interactive.hpp"  // for Component, ScreenInteractive
#include "ftxui/dom/elements.hpp"  // for text, hbox, separator, Element, operator|, vbox, border

#include "../data/auth-manager.hpp"

class Authentication {
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
    ftxui::Component init(std::shared_ptr<AuthManager> g_auth_manager);
};