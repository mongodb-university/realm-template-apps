#include "home_controller.hpp"

ftxui::Component VWrap(std::string name, ftxui::Component component) {
  return Renderer(component, [name, component] {
    return ftxui::vbox({
                           hbox(ftxui::text(name)) | ftxui::hcenter | size(ftxui::WIDTH, ftxui::EQUAL, 18),
                           ftxui::separator(),
                           component->Render() | ftxui::hcenter,
                       });
  });
}

HomeController::HomeController(AppState *appState): Controller(ftxui::Container::Vertical({})), _appState(appState) {
//  ItemManager *itemManager;
//  itemManager->init(appState);

    /** This button row displays at the top of the home screen and provides most of the interactions that change app state.*/
    auto goOfflineButtonLabel = std::string{"Go Offline"};
    auto goOnlineButtonLabel = std::string{"Go Online"};

    if (_appState->databaseState->offlineModeSelection == offlineModeEnabled) {
      state.toggleOfflineModeButtonLabel = goOnlineButtonLabel;
    } else if (_appState->databaseState->offlineModeSelection == offlineModeDisabled) {
      state.toggleOfflineModeButtonLabel = goOfflineButtonLabel;
    }

//    auto toggleOfflineModeButton = ftxui::Button(&state.toggleOfflineModeButtonLabel, [=]{ itemManager->toggleOfflineMode(); });
    auto toggleOfflineModeButton = ftxui::Button(&state.toggleOfflineModeButtonLabel, [=]{  });
    toggleOfflineModeButton = VWrap("Offline Mode", toggleOfflineModeButton);

    auto showAllButtonLabel = std::string{"Show All Tasks"};
    auto showMineButtonLabel = std::string{"Show Only My Tasks"};

    if (_appState->databaseState->subscriptionSelection == allItems) {
      state.toggleSubscriptionsButtonLabel = showMineButtonLabel;
    } else if (_appState->databaseState->subscriptionSelection == myItems) {
      state.toggleSubscriptionsButtonLabel = showAllButtonLabel;
    }

    //auto toggleSubscriptionsButton = ftxui::Button(&state.toggleSubscriptionsButtonLabel, [&]{ itemManager->toggleSubscriptions(); });
    auto toggleSubscriptionsButton = ftxui::Button(&state.toggleSubscriptionsButtonLabel, [&]{  });
    toggleSubscriptionsButton = VWrap("Offline Mode", toggleSubscriptionsButton);

    auto filters = ftxui::Checkbox("Hide completed", &_appState->databaseState->hideCompletedTasks);
    filters = VWrap("Filters", filters);

    auto logoutButton = ftxui::Button("Logout", [&]{ _appState->authManager->logOut(_appState->app.get()); });
    logoutButton = VWrap("Auth", logoutButton);

    auto quitButton = ftxui::Button("Quit", appState->screen->ExitLoopClosure());
    //auto quitButton = ftxui::Button("Quit", {});
    quitButton = VWrap("Exit", quitButton);

    auto optionsLayout = ftxui::Container::Horizontal(
        {toggleOfflineModeButton, toggleSubscriptionsButton, filters, logoutButton, quitButton});

    auto homeControllerButtonView = Renderer(optionsLayout, [=] {
      return vbox(
          hbox(toggleOfflineModeButton->Render(), ftxui::separator(), toggleSubscriptionsButton->Render(),
               ftxui::separator(), filters->Render(), ftxui::separator(),
               logoutButton->Render(), ftxui::separator(), quitButton->Render()) |
              ftxui::border);
    });

    component()->Add(homeControllerButtonView);
}

void HomeController::onFrame() {
  // TODO: Refresh the realm from here to get the synced data between runloops
}