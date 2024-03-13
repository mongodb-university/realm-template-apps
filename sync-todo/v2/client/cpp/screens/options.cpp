#include "options.hpp"

ftxui::Component HWrap(std::string name, ftxui::Component component) {
  return Renderer(component, [name, component] {
    return ftxui::hbox({
               ftxui::text(name) | size(ftxui::WIDTH, ftxui::EQUAL, 8),
               ftxui::separator(),
               component->Render() | ftxui::xflex,
           }) |
           ftxui::xflex;
  });
}

ftxui::Component VWrap(std::string name, ftxui::Component component) {
  return Renderer(component, [name, component] {
    return ftxui::vbox({
        hbox(ftxui::text(name)) | ftxui::hcenter | size(ftxui::WIDTH, ftxui::EQUAL, 18),
        ftxui::separator(),
        component->Render() | ftxui::hcenter,
    });
  });
}

ftxui::Component Options::init(std::shared_ptr<AuthManager> g_auth_manager, ftxui::ScreenInteractive& screen, int* subscriptionSelection, int* offlineModeSelection) {
    // First row of options
    offlineModeOptions = {
            "Enabled ",
            "Disabled",
    };
    offlineMode = ftxui::Toggle(&offlineModeOptions, offlineModeSelection);
    offlineMode = VWrap("Offline Mode", offlineMode);
    ;
    subscriptionOptions = {
            "My Tasks",
            "All Tasks",
    };
    subscriptionToggle =
            ftxui::Toggle(&subscriptionOptions, subscriptionSelection);
    subscriptionToggle = VWrap("Subscriptions", subscriptionToggle);

    hideCompletedSelected = false;
    filters = ftxui::Checkbox("Hide completed", &hideCompletedSelected);
    filters = VWrap("Filters", filters);

    logoutButtonLabel = "Logout";
    logoutButton = ftxui::Button(&logoutButtonLabel, [&]{ g_auth_manager->logoutUser(); });
    logoutButton = VWrap("Auth", logoutButton);

    quitButtonLabel = "Quit";
    quitButton = ftxui::Button(&quitButtonLabel, screen.ExitLoopClosure());
    quitButton = VWrap("Exit", quitButton);

    optionsLayout = ftxui::Container::Horizontal(
        {offlineMode, subscriptionToggle, filters, logoutButton, quitButton});

    return Renderer(optionsLayout, [&] {
      return vbox(
          hbox(offlineMode->Render(), ftxui::separator(), subscriptionToggle->Render(),
               ftxui::separator(), filters->Render(), ftxui::separator(),
               logoutButton->Render(), ftxui::separator(), quitButton->Render()) |
               ftxui::border);
    });
}
