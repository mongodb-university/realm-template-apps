#include "options.hpp"

ftxui::Component VWrap(std::string name, ftxui::Component component) {
  return Renderer(component, [name, component] {
    return ftxui::vbox({
        hbox(ftxui::text(name)) | ftxui::hcenter | size(ftxui::WIDTH, ftxui::EQUAL, 18),
        ftxui::separator(),
        component->Render() | ftxui::hcenter,
    });
  });
}

/// Options display at the top of the dashboard and provide most of the interactions that change app state.
ftxui::Component Options::init(std::shared_ptr<AuthManager> g_auth_manager, ItemManager* itemManager, AppState* appState) {
    goOfflineButtonLabel = "Go Offline";
    goOnlineButtonLabel = "Go Online";

    toggleOfflineModeButtonLabel = "";
    if (appState->offlineModeSelection == offlineModeEnabled) {
        toggleOfflineModeButtonLabel = goOnlineButtonLabel;
    } else if (appState->offlineModeSelection == offlineModeDisabled) {
        toggleOfflineModeButtonLabel = goOfflineButtonLabel;
    }

    toggleOfflineModeButton = ftxui::Button(&toggleOfflineModeButtonLabel, [&]{ itemManager->toggleOfflineMode(appState); });
    toggleOfflineModeButton = VWrap("Offline Mode", toggleOfflineModeButton);

    showAllButtonLabel = "Show All Tasks";
    showMineButtonLabel = "Show Only My Tasks";

    toggleSubscriptionsButtonLabel = "";
    if (appState->subscriptionSelection == allItems) {
        toggleSubscriptionsButtonLabel = showMineButtonLabel;
    } else if (appState->subscriptionSelection == myItems) {
        toggleSubscriptionsButtonLabel = showAllButtonLabel;
    }

    toggleSubscriptionsButton = ftxui::Button(&toggleSubscriptionsButtonLabel, [&]{ itemManager->toggleSubscriptions(appState); });
    toggleSubscriptionsButton = VWrap("Offline Mode", toggleSubscriptionsButton);

    filters = ftxui::Checkbox("Hide completed", &appState->hideCompletedTasks);
    filters = VWrap("Filters", filters);

    logoutButtonLabel = "Logout";
    logoutButton = ftxui::Button(&logoutButtonLabel, [&]{ g_auth_manager->logoutUser(); });
    logoutButton = VWrap("Auth", logoutButton);

    quitButtonLabel = "Quit";
    quitButton = ftxui::Button(&quitButtonLabel, appState->screen.ExitLoopClosure());
    quitButton = VWrap("Exit", quitButton);

    optionsLayout = ftxui::Container::Horizontal(
        {toggleOfflineModeButton, toggleSubscriptionsButton, filters, logoutButton, quitButton});

    return Renderer(optionsLayout, [&] {
      return vbox(
          hbox(toggleOfflineModeButton->Render(), ftxui::separator(), toggleSubscriptionsButton->Render(),
               ftxui::separator(), filters->Render(), ftxui::separator(),
               logoutButton->Render(), ftxui::separator(), quitButton->Render()) |
               ftxui::border);
    });
}
