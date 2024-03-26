#include "database_manager.hpp"

#include <utility>

DatabaseManager::DatabaseManager(AppState *appState, HomeControllerState *homeControllerState): _appState(appState), _homeControllerState(homeControllerState) {
  auto user = _appState->app->get_current_user();

  // Sync configuration and sync subscription management.
  allItemSubscriptionName = "all_items";
  myItemSubscriptionName = "my_items";
  userId = user->identifier();

  auto config = user->flexible_sync_configuration();

  // Handle database sync errors. If there is an error, add the message to the `appState`
  // and change the screen that is displaying to the error modal.
  config.sync_config().set_error_handler([=](const realm::sync_session &session,
                                             const realm::internal::bridge::sync_error &error) {

    auto errorText = SS("A sync error occurred. Message: " << error.message() << std::endl);
    _appState->errorManager->setError(errorText);
  });

  // Initialize the database, and add a subscription to all items. This enables the app to read
  // all items in the data source linked to the App Services App. App Services Rules for the Item collection
  // mean that while the user can read all items, they can only write to their own items.
  auto database = realm::db(std::move(config));
  database.subscriptions().update([&](realm::mutable_sync_subscription_set& subs) {
    // By default, we show all items.
    if (!subs.find(allItemSubscriptionName)) {
      subs.add<realm::Item>(allItemSubscriptionName);
    }
  }).get();

  // Wait for downloads after loading the app, and refresh the database.
  database.get_sync_session()->wait_for_download_completion().get();
  database.refresh();

  // Add a pointer to the database as a class member, so we can access the database later when making changes.
  databasePtr = std::make_unique<realm::db>(database);
}

/** Add a new item to the task list. */
void DatabaseManager::addNew(bool newItemIsComplete, std::string newItemSummary) {
  auto item = realm::Item {
    .isComplete = newItemIsComplete,
    .summary = std::move(newItemSummary),
    .owner_id = userId,
  };

  auto database = *databasePtr;
  database.write([&]{
    database.add(std::move(item));
  });
}

/** Delete an item when the user presses "D" on a selected item. */
void DatabaseManager::remove(realm::managed<realm::Item> itemToDelete) {
  auto database = *databasePtr;
  database.write([&]{
    database.remove(itemToDelete);
  });
}

/** Mark an item as "Completed" when the user presses "C" on a selected item. */
void DatabaseManager::markComplete(realm::managed<realm::Item> itemToMarkComplete) {
  auto database = *databasePtr;
  database.write([&]{
    itemToMarkComplete.isComplete = !itemToMarkComplete.isComplete;
  });
}

/** Get a list of all items in the database. Sort it to show the most recent items on top. */
realm::results<realm::Item> DatabaseManager::getItemList() {
  auto items = databasePtr->objects<realm::Item>();
  items.sort("_id", false);
  return items;
};

/** Get a list of items in the database, filtered to hide completed items. */
realm::results<realm::Item> DatabaseManager::getIncompleteItemList() {
  auto items = databasePtr->objects<realm::Item>();
  auto incompleteItems = items.where(
      [](auto &item) { return item.isComplete == false; });
  incompleteItems.sort("_id", false);
  return incompleteItems;
};

/** Refresh the database from the UI runloop to show data that has synced in the background. */
void DatabaseManager::refreshDatabase() {
  databasePtr->refresh();
};

/** Toggling offline mode simulates having no network connection by pausing sync.
 *  The user can write to the database on device, and the data syncs automatically when sync is resumed. */
void DatabaseManager::toggleOfflineMode() {
  auto syncSession = databasePtr->get_sync_session();
  if (syncSession->state() == realm::internal::bridge::sync_session::state::paused) {
    syncSession->resume();
    _homeControllerState->offlineModeSelection = offlineModeDisabled;
    _homeControllerState->offlineModeLabel = "Go Offline";
  } else if (syncSession->state() == realm::internal::bridge::sync_session::state::active) {
    syncSession->pause();
    _homeControllerState->offlineModeSelection = offlineModeEnabled;
    _homeControllerState->offlineModeLabel = "Go Online";
  }
}

/** Changing the database subscriptions changes which data syncs to the device. */
void DatabaseManager::toggleSubscriptions() {
  // Note the subscription state at the start of the toggle operation.
  // We'll change it after updating the subscriptions.
  int currentSubscriptionState = _homeControllerState->subscriptionSelection;

  databasePtr->subscriptions().update([&](realm::mutable_sync_subscription_set& subs) {
    // If the currentSubscriptionState is `allItems`, toggling it should show only my items.
    // Remove the `allItems` subscription and make sure the subscription for the user's items is present.
    if (currentSubscriptionState == allItems) {
      subs.remove(allItemSubscriptionName);
      // If there isn't yet a subscription for my own items, add it
      if (!subs.find(myItemSubscriptionName)) {
        subs.add<realm::Item>(myItemSubscriptionName,
                              [&](auto &item){
                                return item.owner_id == userId;
                              });
      }
      // Update the subscription selection to reflect the new subscription.
      _homeControllerState->subscriptionSelection = myItems;
      _homeControllerState->subscriptionSelectionLabel = "Switch to All";

      // If the currentSubscriptionState is `myItems`, toggling should show all items.
      // Remove the `myItems` subscription and make sure the subscription for the all items is present.
    } else if (currentSubscriptionState == myItems) {
      subs.remove(myItemSubscriptionName);
      // If the `showAllItems` toggle is selected, and
      // there isn't yet a subscription for all items, add it.
      if (!subs.find(allItemSubscriptionName)) {
        subs.add<realm::Item>(allItemSubscriptionName);
      }

      // Update the subscription selection to reflect the new subscription.
      _homeControllerState->subscriptionSelection = allItems;
      _homeControllerState->subscriptionSelectionLabel = "Switch to Mine";
    }
  }).get();

  // Wait for downloads after changing the subscription.
  databasePtr->get_sync_session()->wait_for_download_completion().get();
}