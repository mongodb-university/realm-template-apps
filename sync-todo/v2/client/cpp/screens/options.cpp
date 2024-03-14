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

ftxui::Component Options::init(std::shared_ptr<AuthManager> g_auth_manager, ItemManager* itemManager, ftxui::ScreenInteractive& screen, int* subscriptionSelection, int* offlineModeSelection, bool* hideComplete) {
    // First row of options
//    offlineModeOptions = {
//            "Enabled ",
//            "Disabled",
//    };
//    offlineMode = ftxui::Toggle(&offlineModeOptions, offlineModeSelection);
//    offlineMode = VWrap("Offline Mode", offlineMode);
    goOfflineButtonLabel = "Go Offline";
    goOnlineButtonLabel = "Go Online";

    toggleOfflineModeButtonLabel = "";
    if (*offlineModeSelection == offlineModeEnabled) {
        toggleOfflineModeButtonLabel = goOnlineButtonLabel;
    } else if (*offlineModeSelection == offlineModeDisabled) {
        toggleOfflineModeButtonLabel = goOfflineButtonLabel;
    }

    toggleOfflineModeButton = ftxui::Button(&toggleOfflineModeButtonLabel, [&]{ itemManager->toggleOfflineMode(offlineModeSelection); });
    toggleOfflineModeButton = VWrap("Offline Mode", toggleOfflineModeButton);

    showAllButtonLabel = "Show All Tasks";
    showMineButtonLabel = "Show Only My Tasks";

    toggleSubscriptionsButtonLabel = "";
    if (*subscriptionSelection == allItems) {
        toggleSubscriptionsButtonLabel = showMineButtonLabel;
    } else if (*subscriptionSelection == myItems) {
        toggleSubscriptionsButtonLabel = showAllButtonLabel;
    }

    toggleSubscriptionsButton = ftxui::Button(&toggleSubscriptionsButtonLabel, [&]{ itemManager->toggleSubscriptions(subscriptionSelection); });
    toggleSubscriptionsButton = VWrap("Offline Mode", toggleSubscriptionsButton);

//    subscriptionOptions = {
//            "My Tasks",
//            "All Tasks",
//    };
//    subscriptionToggle =
//            ftxui::Toggle(&subscriptionOptions, subscriptionSelection);
//    subscriptionToggle = VWrap("Subscriptions", subscriptionToggle);

    hideCompletedSelected = *hideComplete;
    filters = ftxui::Checkbox("Hide completed", &hideCompletedSelected);
    filters = VWrap("Filters", filters);

    logoutButtonLabel = "Logout";
    logoutButton = ftxui::Button(&logoutButtonLabel, [&]{ g_auth_manager->logoutUser(); });
    logoutButton = VWrap("Auth", logoutButton);

    quitButtonLabel = "Quit";
    quitButton = ftxui::Button(&quitButtonLabel, screen.ExitLoopClosure());
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
