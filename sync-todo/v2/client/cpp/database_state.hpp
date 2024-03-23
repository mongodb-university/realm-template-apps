#pragma once

#include "offline_mode_selection.hpp"
#include "subscription_selection.hpp"

struct DatabaseState {
  /** The app uses these properties when creating a new task. */
  std::string newTaskSummary;
  bool newTaskIsComplete{false};

  /** The app uses this to determine which item list to display - all items,
   * or an item list that only displays incomplete items.
   */
  bool hideCompletedTasks{false};

  /** The app uses this int with the `SubscriptionSelection` enum to determine
   * whether to subscribe to all items, or only the user's items.
   */
  SubscriptionSelection subscriptionSelection{allItems};
  std::string subscriptionSelectionLabel;

  /** The app uses this int with the `OfflineModeSelection` enum to determine
   * whether to immediately sync all changes, or simulate offline mode and stop syncing.
   */
  OfflineModeSelection offlineModeSelection{offlineModeDisabled};
  std::string offlineModeLabel;
};