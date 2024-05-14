#include "database_manager.hpp"

DatabaseManager::DatabaseManager(Delegate *delegate, AppState *appState): _delegate(delegate), _appState(appState) {
  auto user = _appState->app->get_current_user();

  // Sync configuration and sync subscription management.
  _allItemSubscriptionName = "all_items";
  _myItemSubscriptionName = "my_items";
  _userId = user->identifier();

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
  _database = std::make_unique<realm::db>(std::move(config));
  _database->subscriptions().update([this](realm::mutable_sync_subscription_set& subs) {
    // By default, we show all items.
    if (!subs.find(_allItemSubscriptionName)) {
      subs.add<realm::Item>(_allItemSubscriptionName);
    }
  }).get();

  // Wait for downloads after loading the app, and refresh the database.
  _database->get_sync_session()->wait_for_download_completion().get();
  _database->refresh();
}

/** Add a new item to the task list. */
void DatabaseManager::addNew(bool newItemIsComplete, std::string newItemSummary) {
  auto item = realm::Item {
    .isComplete = newItemIsComplete,
    .summary = std::move(newItemSummary),
    .owner_id = _userId,
  };

  _database->write([&]{
    _database->add(std::move(item));
  });
}

/** Delete an item when the user presses "D" on a selected item. */
void DatabaseManager::remove(realm::managed<realm::Item> itemToDelete) {
  _database->write([&]{
    _database->remove(itemToDelete);
  });
}

/** Mark an item as "Completed" when the user presses "C" on a selected item. */
void DatabaseManager::markComplete(realm::managed<realm::Item> itemToMarkComplete) {
  _database->write([&]{
    itemToMarkComplete.isComplete = !itemToMarkComplete.isComplete;
  });
}

/** Refresh the database from the UI runloop to show data that has synced in the background. */
void DatabaseManager::refreshDatabase() {
  _database->refresh();
}

/** Toggling offline mode simulates having no network connection by pausing sync.
 *  The user can write to the database on device, and the data syncs automatically when sync is resumed. */
void DatabaseManager::toggleOfflineMode() {
  auto syncSession = _database->get_sync_session();
  if (syncSession->state() == realm::internal::bridge::sync_session::state::paused) {
    syncSession->resume();
    _delegate->onSyncSessionResumed();
  } else if (syncSession->state() == realm::internal::bridge::sync_session::state::active) {
    syncSession->pause();
    _delegate->onSyncSessionPaused();
  }
}

/** Changing the database subscriptions changes which data syncs to the device. */
void DatabaseManager::toggleSubscriptions() {
  auto syncSession = _database->get_sync_session();
  if (syncSession->state() == realm::internal::bridge::sync_session::state::paused) {
    _appState->errorManager->setError("Please go online before changing subscriptions.");
    return;
  }
  // Note the subscription state at the start of the toggle operation.
  // We'll change it after updating the subscriptions.
  auto currentSubscriptionState = _delegate->getSubscriptionSelection();

  _database->subscriptions().update([&](realm::mutable_sync_subscription_set& subs) {
    // If the currentSubscriptionState is `allItems`, toggling it should show only my items.
    // Remove the `allItems` subscription and make sure the subscription for the user's items is present.
    if (currentSubscriptionState == SubscriptionSelection::allItems) {
      subs.remove(_allItemSubscriptionName);
      // If there isn't yet a subscription for my own items, add it
      if (!subs.find(_myItemSubscriptionName)) {
        subs.add<realm::Item>(_myItemSubscriptionName,
                              [&](auto &item){
                                return item.owner_id == _userId;
                              });
      }
      // Update the subscription selection to reflect the new subscription.
      _delegate->onSubscriptionSelectionMyItems();

      // If the currentSubscriptionState is `myItems`, toggling should show all items.
      // Remove the `myItems` subscription and make sure the subscription for the all items is present.
    } else if (currentSubscriptionState == SubscriptionSelection::myItems) {
      subs.remove(_myItemSubscriptionName);
      // If the `showAllItems` toggle is selected, and
      // there isn't yet a subscription for all items, add it.
      if (!subs.find(_allItemSubscriptionName)) {
        subs.add<realm::Item>(_allItemSubscriptionName);
      }

      // Update the subscription selection to reflect the new subscription.
      _delegate->onSubscriptionSelectionAllItems();
    }
  }).get();

  // Wait for downloads after changing the subscription.
  _database->get_sync_session()->wait_for_download_completion().get();
}

/** Get a list of all items in the database. Sort it to show the most recent items on top. */
realm::results<realm::Item> DatabaseManager::getItemList() {
  auto items = _database->objects<realm::Item>();
  auto sortedItems = items.sort("_id", false);
  return sortedItems;
}

/** Get a list of items in the database, filtered to hide completed items. */
realm::results<realm::Item> DatabaseManager::getIncompleteItemList() {
  auto items = _database->objects<realm::Item>();
  auto incompleteItems = items.where(
      [](auto const &item) { return item.isComplete == false; });
  auto sortedIncompleteItems = incompleteItems.sort("_id", false);
  return sortedIncompleteItems;
}
