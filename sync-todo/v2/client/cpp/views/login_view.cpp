//#include "login_view.hpp"
//
//ftxui::Component LoginView::init(LoginController* _loginController) {
//  inputEmail = ftxui::Input(&login, "Email");
//  inputOptionForPassword.password = true;
//  inputPassword = Input(&password, "password", inputOptionForPassword);
//
//  loginButtonLabel = "Login";
//  onLoginButtonClick = [&] {
//    _authManager->loginUser(email, password); };
//  loginButton = ftxui::Button(&loginButtonLabel, onLoginButtonClick);
//
//  registerButtonLabel = "Register";
//  onRegisterButtonClick = [&] {
//    _authManager->registerAndLoginUser(email, password);};
//  registerButton = ftxui::Button(&registerButtonLabel, onRegisterButtonClick);
//
//  buttonLayout = ftxui::Container::Horizontal({loginButton, registerButton});
//
//  screenLayout = ftxui::Container::Vertical(
//      {inputEmail, inputPassword, buttonLayout});
//
//  return Renderer(screenLayout, [&] {
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