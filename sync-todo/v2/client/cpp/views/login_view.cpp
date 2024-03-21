//#include "login_view.hpp"
//
//ftxui::Component LoginView::init(LoginController* _loginController) {
//  auto inputEmail = ftxui::Input(&state.userEmail, "Email");
//  auto inputOptionForPassword = ftxui::InputOption{};
//  inputOptionForPassword.password = true;
//  auto inputPassword = Input(&state.userPassword, "password", inputOptionForPassword);
//
//  auto loginButton = ftxui::Button("Login", [this] {
//    _appState->authManager->logIn(_appState->app.get(), state.userEmail, state.userPassword);
//  });
//
//  auto registerButton = ftxui::Button("Register", [this] {
//    _appState->authManager->registerAndLoginUser(_appState->app.get(), state.userEmail, state.userPassword);
//  });
//
//  auto buttonLayout = ftxui::Container::Horizontal({loginButton, registerButton});
//
//  auto screenLayout = ftxui::Container::Vertical(
//      {inputEmail, inputPassword, buttonLayout});
//
//  auto view = Renderer(screenLayout, [=] {
//    return ftxui::vbox({
//                           ftxui::hbox(ftxui::text(" Atlas Device SDK C++ Todo ") | ftxui::hcenter),
//                           ftxui::separator(),
//                           ftxui::hbox(ftxui::text(" Email : "), inputEmail->Render()),
//                           ftxui::hbox(ftxui::text(" Password   : "), inputPassword->Render()),
//                           ftxui::separator(),
//                           ftxui::hbox({
//                                           ftxui::filler(),
//                                           loginButton->Render(),
//                                           registerButton->Render(),
//                                           ftxui::filler(),
//                                       }),
//                           ftxui::separator(),
//                           ftxui::hbox(ftxui::text("Please log in or register with a Device Sync user "
//                                                   "account. ") |
//                               ftxui::hcenter),
//                           hbox(ftxui::text("This is separate from your Atlas Cloud login.") |
//                               ftxui::hcenter),
//                       }) |
//        ftxui::xflex | size(ftxui::WIDTH, ftxui::GREATER_THAN, 60) | ftxui::border;
//  });
//}