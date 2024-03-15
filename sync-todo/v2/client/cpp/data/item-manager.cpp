#include "item-manager.hpp"

void ItemManager::init(realm::user& user, AppState* appState) {
    // Sync configuration and sync subscription management.
    allItemSubscriptionName = "all_items";
    myItemSubscriptionName = "my_items";
    userId = user.identifier();

    auto config = user.flexible_sync_configuration();

    // Handle database sync errors. If there is an error, add the message to the `appState`
    // and change the screen that is displaying to the error modal.
    config.sync_config().set_error_handler([&appState](const realm::sync_session &session,
                                              const realm::internal::bridge::sync_error &error) {

        auto errorText = SS("A sync error occurred. Message: " << error.message() << std::endl);
        appState->errorMessage = errorText;
        appState->screenDisplaying = errorModalComponent;
    });

    /* Initialize the database, and add a subscription to all items. This enables the app to read
       all items in the data source linked to the App Services App. App Services Rules for the Item collection
       mean that while the user can read all items, they can only write to their own items. */
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

/// Add a new item to the task list.
void ItemManager::addNew(AppState* appState) {
    auto item = realm::Item {
        .isComplete = appState->newTaskIsComplete,
        .summary = std::move(appState->newTaskSummary),
        .owner_id = std::move(userId),
    };

    auto database = *databasePtr;
    database.write([&]{
        database.add(std::move(item));
    });
}

/// Delete an item when the user presses "D" on a selected item.
void ItemManager::remove(realm::managed<realm::Item> itemToDelete) {
    auto database = *databasePtr;
    database.write([&]{
        database.remove(itemToDelete);
    });
}

/// Mark an item as "Completed" when the user presses "C" on a selected item.
void ItemManager::markComplete(realm::managed<realm::Item> itemToMarkComplete) {
    auto database = *databasePtr;
    database.write([&]{
        if (itemToMarkComplete.isComplete == true) {
            itemToMarkComplete.isComplete = false;
        } else if (itemToMarkComplete.isComplete == false) {
            itemToMarkComplete.isComplete = true;
        }
    });
}

/// Get a list of all items in the database.
realm::results<realm::Item> ItemManager::getItemList() {
    auto items = databasePtr->objects<realm::Item>();
    return items;
};

/// Get a list of items in the database, filtered to hide completed items.
realm::results<realm::Item> ItemManager::getIncompleteItemList() {
    auto items = databasePtr->objects<realm::Item>();
    auto incompleteItems = items.where(
            [](auto &item) { return item.isComplete == false; });
    return incompleteItems;
};

/// Refresh the database from the UI runloop to show data that has synced in the background.
void ItemManager::refreshDatabase() {
    databasePtr->refresh();
};

/// Toggling offline mode simulates having no network connection by pausing sync.
/// The user can write to the database on device, and the data syncs automatically when sync is resumed.
void ItemManager::toggleOfflineMode(AppState* appState) {
    auto syncSession = databasePtr->get_sync_session();
    if (syncSession->state() == realm::internal::bridge::sync_session::state::paused) {
        syncSession->resume();
        appState->offlineModeSelection = offlineModeDisabled;
    } else if (syncSession->state() == realm::internal::bridge::sync_session::state::active) {
        syncSession->pause();
        appState->offlineModeSelection = offlineModeEnabled;
    }
}

/// Changing the database subscriptions changes which data syncs to the device.
void ItemManager::toggleSubscriptions(AppState* appState) {
    // Note the subscription state at the start of the toggle operation.
    // We'll change it after updating the subscriptions.
    int currentSubscriptionState = appState->subscriptionSelection;

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
            appState->subscriptionSelection = myItems;

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
            appState->subscriptionSelection = allItems;
        }
    }).get();

    // Wait for downloads after changing the subscription.
    databasePtr->get_sync_session()->wait_for_download_completion().get();
}