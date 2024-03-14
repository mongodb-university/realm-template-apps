#include "item-manager.hpp"

void ItemManager::init(realm::user* mUser, std::string* errorMessage, int* displayScreen) {
    // Sync configuration and sync subscription management.
    allItemSubscriptionName = "all_items";
    myItemSubscriptionName = "my_items";
    userId = mUser->identifier();

    // TODO: Change user to a reference
    auto config = mUser->flexible_sync_configuration();
    config.sync_config().set_error_handler([&errorMessage, &displayScreen](const realm::sync_session &session,
                                              const realm::internal::bridge::sync_error &error) {
        //std::stringstream ss;
        //ss << "A sync error occurred. Message: " << error.message() << std::endl;
        auto errorText = SS("A sync error occurred. Message: " << error.message() << std::endl);
        *errorMessage = errorText;
        *displayScreen = errorModalComponent;
    });
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

    databasePtr = std::make_unique<realm::db>(database);
}

void ItemManager::addNew(std::string summary, bool isComplete) {
    auto item = realm::Item {
        .isComplete = isComplete,
        .summary = std::move(summary),
        .owner_id = std::move(userId),
    };
//    auto config = mUser.flexible_sync_configuration();
//    auto database = realm::db(std::move(config));
    auto database = *databasePtr;
    database.write([&]{
        database.add(std::move(item));
    });
}

void ItemManager::remove(realm::managed<realm::Item> itemToDelete) {
    auto database = *databasePtr;
    database.write([&]{
        database.remove(itemToDelete);
    });
}

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

realm::results<realm::Item> ItemManager::getItemList() {
    auto items = databasePtr->objects<realm::Item>();
    return items;
};

realm::results<realm::Item> ItemManager::getIncompleteItemList() {
    auto items = databasePtr->objects<realm::Item>();
    auto incompleteItems = items.where(
            [](auto &item) { return item.isComplete == false; });
    return incompleteItems;
};

void ItemManager::refreshDatabase() {
    databasePtr->refresh();
};

void ItemManager::toggleOfflineMode(int* offlineModeSelection) {
    auto syncSession = databasePtr->get_sync_session();
    if (syncSession->state() == realm::internal::bridge::sync_session::state::paused) {
        syncSession->resume();
        *offlineModeSelection = offlineModeDisabled;
    } else if (syncSession->state() == realm::internal::bridge::sync_session::state::active) {
        syncSession->pause();
        *offlineModeSelection = offlineModeEnabled;
    }
}

void ItemManager::toggleSubscriptions(int* subscriptionSelection) {
    // Note the subscription state at the start of the toggle operation.
    // We'll change it after updating the subscriptions.
    int currentSubscriptionState = *subscriptionSelection;

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
            *subscriptionSelection = myItems;

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
            *subscriptionSelection = allItems;
        }
    }).get();

    // Wait for downloads after changing the subscription.
    databasePtr->get_sync_session()->wait_for_download_completion().get();
}