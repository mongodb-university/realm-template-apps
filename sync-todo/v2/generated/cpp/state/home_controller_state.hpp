#ifndef HOME_CONTROLLER_STATE_HPP
#define HOME_CONTROLLER_STATE_HPP

#include "offline_mode_selection.hpp"
#include "subscription_selection.hpp"

struct HomeControllerState {
  // Used for creating a new task.
  std::string newTaskSummary;
  bool newTaskIsComplete{false};

  // Display all items, or only display incomplete items.
  bool hideCompletedTasks{false};

  // Whether to subscribe to all items, or only the user's items.
  SubscriptionSelection subscriptionSelection{SubscriptionSelection::allItems};
  std::string subscriptionSelectionLabel;

  // Whether to immediately sync all changes, or simulate offline mode and stop syncing.
  OfflineModeSelection offlineModeSelection{OfflineModeSelection::offlineModeDisabled};
  std::string offlineModeLabel;
};

#endif
