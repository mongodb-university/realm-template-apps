#include "home_controller.hpp"

/** Conveniently provide a vertical wrapper for a text label and a component, centered. */
ftxui::Component VWrap(const std::string& name, const ftxui::Component& component) {
  return Renderer(component, [name, component] {
    return ftxui::vbox({
      hbox(ftxui::text(name)) | ftxui::hcenter | size(ftxui::WIDTH, ftxui::EQUAL, 18),
      ftxui::separator(),
      component->Render() | ftxui::hcenter,
      });
  });
}

HomeController::HomeController(AppState *appState): Controller(ftxui::Container::Vertical({})), _appState(appState),
                                                    _dbManager(this, _appState) {
  auto user = _appState->app->get_current_user();
  auto userId = user->identifier();

  // This button row displays at the top of the home screen and provides most of the interactions to change app state.
  auto goOfflineButtonLabel = std::string{"Go Offline"};
  auto goOnlineButtonLabel = std::string{"Go Online"};

  if (_homeControllerState.offlineModeSelection == OfflineModeSelection::offlineModeEnabled) {
    _homeControllerState.offlineModeLabel = goOnlineButtonLabel;
  } else if (_homeControllerState.offlineModeSelection == OfflineModeSelection::offlineModeDisabled) {
    _homeControllerState.offlineModeLabel = goOfflineButtonLabel;
  }

  auto toggleOfflineModeButton = ftxui::Button(&_homeControllerState.offlineModeLabel,
                                               [this]{ _dbManager.toggleOfflineMode(); });
  toggleOfflineModeButton = VWrap("Offline Mode", toggleOfflineModeButton);

  auto showAllButtonLabel = std::string{"Switch to All"};
  auto showMineButtonLabel = std::string{"Switch to Mine"};

  if (_homeControllerState.subscriptionSelection == SubscriptionSelection::allItems) {
    _homeControllerState.subscriptionSelectionLabel = showMineButtonLabel;
  } else if (_homeControllerState.subscriptionSelection == SubscriptionSelection::myItems) {
    _homeControllerState.subscriptionSelectionLabel = showAllButtonLabel;
  }

  auto toggleSubscriptionsButton = ftxui::Button(&_homeControllerState.subscriptionSelectionLabel,
                                                 [this]{ _dbManager.toggleSubscriptions();
  });
  toggleSubscriptionsButton = VWrap("Subscription", toggleSubscriptionsButton);

  auto filters = ftxui::Checkbox("Hide completed", &_homeControllerState.hideCompletedTasks);
  filters = VWrap("Filters", filters);

  auto logoutButton = ftxui::Button("Logout",
                                    [this]{ _appState->authManager->logOut(); });
  logoutButton = VWrap("Auth", logoutButton);

  auto quitButton = ftxui::Button("Quit", appState->screen->ExitLoopClosure());
  quitButton = VWrap("Exit", quitButton);

  auto optionsLayout = ftxui::Container::Horizontal(
      {toggleOfflineModeButton, toggleSubscriptionsButton, filters, logoutButton, quitButton});

  auto homeControllerButtonView = Renderer(optionsLayout, [=] {
    return vbox(
        hbox(
             toggleOfflineModeButton->Render() | size(ftxui::HEIGHT, ftxui::EQUAL, 10),
             ftxui::separator(),
             toggleSubscriptionsButton->Render(),
             ftxui::separator(),
             filters->Render(), ftxui::separator(),
             logoutButton->Render(),
             ftxui::separator(),
             quitButton->Render()
             ) | ftxui::border | ftxui::center | size(ftxui::WIDTH, ftxui::EQUAL, 100)) ;
  });

  // Accept user inputs and create new items in the database.
  auto inputNewTaskSummary =
      ftxui::Input(&_homeControllerState.newTaskSummary, "Enter new task summary");
  auto newTaskCompletionStatus = ftxui::Checkbox("Complete", &_homeControllerState.newTaskIsComplete);

  auto saveButton = ftxui::Button("Save", [this] {
    _dbManager.addNew(_homeControllerState.newTaskIsComplete, _homeControllerState.newTaskSummary);
    _homeControllerState.newTaskSummary = "";
    _homeControllerState.newTaskIsComplete = false;
  });

  auto newTaskLayout = ftxui::Container::Horizontal(
      {inputNewTaskSummary, newTaskCompletionStatus, saveButton});

  // Lay out and render the scrollable task list.
  auto renderTasks = ftxui::Renderer([=] {
    auto itemList = _homeControllerState.hideCompletedTasks ? _dbManager.getIncompleteItemList() : _dbManager.getItemList();
    ftxui::Elements tasks;
    // If the user has toggled the checkbox to hide completed tasks, show only the incomplete task list.
    // Otherwise, show all items.
    for (auto const &item: itemList) {
      std::string completionString = (item.isComplete) ? " Complete " : " Incomplete ";
      std::string mineOrNot = (item.owner_id == userId) ? "   Mine " : " Theirs ";
      auto taskRow = ftxui::hbox({
        ftxui::text(item.summary) | ftxui::flex,
        align_right(ftxui::text(completionString)),
        align_right(ftxui::text(mineOrNot))
      }) | size(ftxui::WIDTH, ftxui::GREATER_THAN, 100);
      tasks.push_back(taskRow);
    }
    auto content = vbox(std::move(tasks));
    return content;
  });

  // Render a scrollable task list that can accept keyboard events to mark items as complete or delete them.
  auto scroller = Scroller(renderTasks);

  auto scrollerRenderer = Renderer(scroller, [=] {
    return ftxui::vbox({
      scroller->Render() | ftxui::flex,
      });
  });

  auto scrollerContainer = scrollerRenderer;
  scrollerContainer =
      Renderer(scrollerContainer, [=] { return scrollerContainer->Render() | ftxui::flex; });

  // Handle keyboard events.
  scrollerContainer = CatchEvent(scrollerContainer, [=](ftxui::Event const &event) {
    auto itemList = _homeControllerState.hideCompletedTasks ? _dbManager.getIncompleteItemList() : _dbManager.getItemList();
    // Delete items from the database
    if (event == ftxui::Event::Character('d')) {
      // Get index of selected item in the scroller
      auto scrollerIndex = scroller->getScrollerIndex();
      // Get the matching managed Item from the Results set
      auto managedItemAtIndex = itemList[scrollerIndex];
      // Delete the item from the database
      _dbManager.remove(managedItemAtIndex);
      return true;
    }

    // Mark items complete
    if (event == ftxui::Event::Character('c')) {
      auto scrollerIndex = scroller->getScrollerIndex();
      auto managedItemAtIndex = itemList[scrollerIndex];
      _dbManager.markComplete(managedItemAtIndex);
      return true;
    }
    return false;
  });

  // Lay out and render the item list
  ftxui::Element taskTableHeaderRow = ftxui::hbox({
    ftxui::text(L" Summary ") | ftxui::flex | ftxui::bold,
    align_right(ftxui::text(L" Status ")),
    align_right(ftxui::text(L" Owner ")),
  });

  auto itemListLayout = ftxui::Container::Vertical({
    newTaskLayout, scrollerContainer
  });

  auto itemListRenderer = Renderer(itemListLayout, [=] {
    auto content = ftxui::vbox({
      ftxui::hbox({
        inputNewTaskSummary->Render() | ftxui::flex,
        newTaskCompletionStatus->Render() | ftxui::center,
        saveButton->Render(),
        }) | size(ftxui::WIDTH, ftxui::GREATER_THAN, 80),
        ftxui::separator(),
        taskTableHeaderRow,
        ftxui::separator(),
        scrollerContainer->Render(),
        ftxui::separator(),
        ftxui::text("In the list, press 'c' to mark the selected item complete, 'd' to delete"),
        ftxui::separator(),
        ftxui::text("To view your data in Atlas, visit the following link: "),
        ftxui::text(_appState->appConfigMetadata.dataExplorerLink)
        }) | ftxui::center;
    return window(ftxui::text(L" Todo List "), content);
  });

  auto dashboardContainer = ftxui::Container::Vertical({
    homeControllerButtonView,
    itemListLayout
  });

  auto dashboardRenderer = Renderer(dashboardContainer, [=] {
    auto content = ftxui::vbox({
      homeControllerButtonView->Render(),
      itemListRenderer->Render()
    });
    return window(ftxui::text(L" Todo Tracker "), content);
  });
  component()->Add(dashboardRenderer);
}

void HomeController::onFrame() {
  // Refresh the database to show new items that have synced in the background.
  _dbManager.refreshDatabase();
}

void HomeController::onSyncSessionPaused() {
  _homeControllerState.offlineModeSelection = OfflineModeSelection::offlineModeEnabled;
  _homeControllerState.offlineModeLabel = "Go Online";
}

void HomeController::onSyncSessionResumed() {
  _homeControllerState.offlineModeSelection = OfflineModeSelection::offlineModeDisabled;
  _homeControllerState.offlineModeLabel = "Go Offline";
}

void HomeController::onSubscriptionSelectionMyItems() {
  _homeControllerState.subscriptionSelection = SubscriptionSelection::myItems;
  _homeControllerState.subscriptionSelectionLabel = "Switch to All";
}

void HomeController::onSubscriptionSelectionAllItems() {
  _homeControllerState.subscriptionSelection = SubscriptionSelection::allItems;
  _homeControllerState.subscriptionSelectionLabel = "Switch to Mine";
}

SubscriptionSelection HomeController::getSubscriptionSelection() {
  return _homeControllerState.subscriptionSelection;
}