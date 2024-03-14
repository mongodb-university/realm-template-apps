#pragma once

#include <string>

#include "item.hpp"
#include "/Users/dachary.carey/workspace/realm-template-apps/sync-todo/v2/client/cpp/ss.hpp"
#include "display-screen.hpp"
#include "subscription-selection.hpp"
#include "offline-mode-selection.hpp"

class ItemManager {
private:
    std::string allItemSubscriptionName;
    std::string myItemSubscriptionName;
    std::unique_ptr<realm::db> databasePtr;
    std::string userId;

public:
    void init(realm::user* mUser, std::string* errorMessage, int* displayScreen);
    void addNew(std::string summary, bool isComplete);
    void remove(realm::managed<realm::Item> itemToDelete);
    void markComplete(realm::managed<realm::Item> itemToMarkComplete);
    void refreshDatabase();
    void toggleOfflineMode(int* offlineModeSelection);
    realm::results<realm::Item> getItemList();
    realm::results<realm::Item> getIncompleteItemList();
    void toggleSubscriptions(int* subscriptionSelection);
};
