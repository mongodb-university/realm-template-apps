//#include "home_screen_button_row.hpp"
//
//ftxui::Component VWrap(std::string name, ftxui::Component component) {
//  return Renderer(component, [name, component] {
//    return ftxui::vbox({
//                           hbox(ftxui::text(name)) | ftxui::hcenter | size(ftxui::WIDTH, ftxui::EQUAL, 18),
//                           ftxui::separator(),
//                           component->Render() | ftxui::hcenter,
//                       });
//  });
//}

///** This button row displays at the top of the home screen and provides most of the interactions that change app state.*/
//ftxui::Component Options::init(AppState *appState, ItemManager* itemManager) {
//  /** This button row displays at the top of the home screen and provides most of the interactions that change app state.*/
//  auto goOfflineButtonLabel = std::string{"Go Offline"};
//  auto goOnlineButtonLabel = std::string{"Go Online"};
//
//  if (_appState->databaseState->offlineModeSelection == offlineModeEnabled) {
//  state.toggleOfflineModeButtonLabel = goOnlineButtonLabel;
//  } else if (_appState->databaseState->offlineModeSelection == offlineModeDisabled) {
//  state.toggleOfflineModeButtonLabel = goOfflineButtonLabel;
//  }
//
//  //    auto toggleOfflineModeButton = ftxui::Button(&state.toggleOfflineModeButtonLabel, [=]{ itemManager->toggleOfflineMode(); });
//  auto toggleOfflineModeButton = ftxui::Button(&state.toggleOfflineModeButtonLabel, [=]{  });
//  toggleOfflineModeButton = VWrap("Offline Mode", toggleOfflineModeButton);
//
//  auto showAllButtonLabel = std::string{"Show All Tasks"};
//  auto showMineButtonLabel = std::string{"Show Only My Tasks"};
//
//  if (_appState->databaseState->subscriptionSelection == allItems) {
//  state.toggleSubscriptionsButtonLabel = showMineButtonLabel;
//  } else if (_appState->databaseState->subscriptionSelection == myItems) {
//  state.toggleSubscriptionsButtonLabel = showAllButtonLabel;
//  }
//
//  //auto toggleSubscriptionsButton = ftxui::Button(&state.toggleSubscriptionsButtonLabel, [&]{ itemManager->toggleSubscriptions(); });
//  auto toggleSubscriptionsButton = ftxui::Button(&state.toggleSubscriptionsButtonLabel, [&]{  });
//  toggleSubscriptionsButton = VWrap("Offline Mode", toggleSubscriptionsButton);
//
//  auto filters = ftxui::Checkbox("Hide completed", &_appState->databaseState->hideCompletedTasks);
//  filters = VWrap("Filters", filters);
//
//  auto logoutButton = ftxui::Button("Logout", [&]{ _appState->authManager->logOut(_appState->app.get()); });
//  logoutButton = VWrap("Auth", logoutButton);
//
//  auto quitButton = ftxui::Button("Quit", appState->screen->ExitLoopClosure());
//  //auto quitButton = ftxui::Button("Quit", {});
//  quitButton = VWrap("Exit", quitButton);
//
//  auto optionsLayout = ftxui::Container::Horizontal(
//      {toggleOfflineModeButton, toggleSubscriptionsButton, filters, logoutButton, quitButton});
//
//  auto homeControllerButtonView = Renderer(optionsLayout, [=] {
//    return vbox(
//        hbox(toggleOfflineModeButton->Render(), ftxui::separator(), toggleSubscriptionsButton->Render(),
//             ftxui::separator(), filters->Render(), ftxui::separator(),
//             logoutButton->Render(), ftxui::separator(), quitButton->Render()) |
//            ftxui::border);
//  });
//}
//
//HomeScreenButtonRowBase::HomeScreenButtonRowBase(HomeScreenButtonRowState *buttonRowState) {
//  auto focused = Focused() ? ftxui::focus : ftxui::select;
//  auto style = Focused() ? ftxui::inverted : ftxui::nothing;
//
//  if (buttonRowState->appState->databaseState->offlineModeSelection == offlineModeEnabled) {
//    buttonRowState->toggleOfflineModeButtonLabel = goOnlineButtonLabel;
//  } else if (buttonRowState->appState->databaseState->offlineModeSelection == offlineModeDisabled) {
//    buttonRowState->toggleOfflineModeButtonLabel = goOfflineButtonLabel;
//  }
//
//  //    auto toggleOfflineModeButton = ftxui::Button(&state.toggleOfflineModeButtonLabel, [=]{ itemManager->toggleOfflineMode(); });
//  buttonRowState->toggleOfflineModeButton = ftxui::Button(&buttonRowState->toggleOfflineModeButtonLabel, [=]{  });
//  buttonRowState->toggleOfflineModeButton = VWrap("Offline Mode", buttonRowState->toggleOfflineModeButton);
//
//  if (buttonRowState->appState->databaseState->subscriptionSelection == allItems) {
//    buttonRowState->toggleSubscriptionsButtonLabel = buttonRowState->showMineButtonLabel;
//  } else if (buttonRowState->appState->databaseState->subscriptionSelection == myItems) {
//    buttonRowState->toggleSubscriptionsButtonLabel = showAllButtonLabel;
//  }
//
//  //auto toggleSubscriptionsButton = ftxui::Button(&state.toggleSubscriptionsButtonLabel, [&]{ itemManager->toggleSubscriptions(); });
//  buttonRowState->toggleSubscriptionsButton = ftxui::Button(buttonRowState->toggleSubscriptionsButtonLabel, [&]{  });
//  buttonRowState->toggleSubscriptionsButton = VWrap("Offline Mode", buttonRowState->toggleSubscriptionsButton);
//
//  buttonRowState->filters = ftxui::Checkbox("Hide completed", &buttonRowState->appState->databaseState->hideCompletedTasks);
//  buttonRowState->filters = VWrap("Filters", buttonRowState->filters);
//
//  buttonRowState->logoutButton = ftxui::Button("Logout", [&]{ buttonRowState->appState->authManager->logOut(buttonRowState->appState->app.get()); });
//  buttonRowState->logoutButton = VWrap("Auth", buttonRowState->logoutButton);
//
//  buttonRowState->quitButton = ftxui::Button("Quit", buttonRowState->appState->screen->ExitLoopClosure());
//  //auto quitButton = ftxui::Button("Quit", {});
//  buttonRowState->quitButton = VWrap("Exit", buttonRowState->quitButton);
//
//  buttonRowState->optionsLayout = ftxui::Container::Horizontal({
//    buttonRowState->toggleOfflineModeButton,
//    buttonRowState->toggleSubscriptionsButton,
//    buttonRowState->filters,
//    buttonRowState->logoutButton,
//    buttonRowState->quitButton});
//
//  buttonRowState->optionsRowRenderer = Renderer(optionsLayout, [=] {
//    return vbox(
//        hbox(toggleOfflineModeButton->Render(), ftxui::separator(), toggleSubscriptionsButton->Render(),
//             ftxui::separator(), filters->Render(), ftxui::separator(),
//             logoutButton->Render(), ftxui::separator(), quitButton->Render()) |
//            ftxui::border);
//  });
//  Add(buttonRowState->optionsRowRenderer);
//}
//
////ftxui::Element HomeScreenButtonRowBase::Render() {
////
////}
//
//bool HomeScreenButtonRowBase::Focusable() const { return true; }
//
//std::shared_ptr<HomeScreenButtonRowBase> HomeScreenButtonRow(HomeScreenButtonRowState *state) {
//  return ftxui::Make<HomeScreenButtonRowBase>(std::move(state));
//};