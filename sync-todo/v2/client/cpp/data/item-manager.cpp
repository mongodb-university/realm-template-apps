#include "item-manager.hpp"

void ItemManager::init(realm::user* mUser, int subscriptionSelection, int offlineModeSelection, std::string* errorMessage, int* depth) {
    // Sync configuration and sync subscription management.
    allItemSubscriptionName = "all_items";
    myItemSubscriptionName = "my_items";

    // TODO: Change user to a reference
    auto config = mUser->flexible_sync_configuration();
    config.sync_config().set_error_handler([&errorMessage, &depth](const realm::sync_session &session,
                                              const realm::internal::bridge::sync_error &error) {
        //std::stringstream ss;
        //ss << "A sync error occurred. Message: " << error.message() << std::endl;
        auto errorText = SS("A sync error occurred. Message: " << error.message() << std::endl);
        *errorMessage = errorText;
        *depth = 2;
    });
    // TODO: Make a pointer to this that I can pass to the methods that need to use the DB
    auto database = realm::db(std::move(config));
    database.subscriptions().update([&](realm::mutable_sync_subscription_set& subs) {
        // If the `subscriptionSelection` is 1, the toggle for `My Items` is selected.
        // Remove the subscription to all items.
        if (subscriptionSelection == 1) {
            subs.remove(allItemSubscriptionName);
        } else if (!subs.find(myItemSubscriptionName)) {
            // If there isn't yet a subscription for my own items, add it
            subs.add<realm::Item>(myItemSubscriptionName,
                                  [&](auto &item){
                return item.owner_id == mUser->identifier();
            });
            // If the `showMyItems` toggle is not selected, and
            // there isn't yet a subscription for all items, add it.
            if (!subs.find(allItemSubscriptionName) && !subs.find(allItemSubscriptionName)) {
                subs.add<realm::Item>(allItemSubscriptionName);
            }
        }
    }).get();

    // Wait for downloads after potentially changing the subscription, and refresh the database.
    database.get_sync_session()->wait_for_download_completion().get();
    database.refresh();

    // Item manager.
    databasePtr = std::make_unique<realm::db>(database);
//    auto items = database.objects<realm::Item>();
//    itemList = std::make_shared<realm::results<realm::Item>>(items);

    //itemCount = items.size();
    //incompleteItemCount = items.where([](auto &thisItem) { return thisItem.isComplete == false; }).size();
    //completedItemCount = items.where([](auto &thisItem) { return thisItem.isComplete == true; }).size();
    //myItemCount = items.where([&](auto &thisItem) { return thisItem.owner_id == mUser.identifier(); }).size();
}

void ItemManager::addNew(std::string summary, bool isComplete, std::string userId) {
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
//    auto config = mUser.flexible_sync_configuration();
//    auto database = realm::db(std::move(config));
    auto database = *databasePtr;
    database.write([&]{
        database.remove(itemToDelete);
    });
}

void ItemManager::markComplete(realm::managed<realm::Item> itemToMarkComplete) {
//    auto config = mUser.flexible_sync_configuration();
//    auto database = realm::db(std::move(config));
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