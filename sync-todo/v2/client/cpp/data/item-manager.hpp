#pragma once

#include <string>

#include "../ss.hpp"
#include "app-state.hpp"
#include "display-screen.hpp"
#include "item.hpp"
#include "offline-mode-selection.hpp"
#include "subscription-selection.hpp"

class ItemManager {
private:
    std::string allItemSubscriptionName;
    std::string myItemSubscriptionName;
    std::unique_ptr<realm::db> databasePtr;
    std::string userId;

public:
    void init(realm::user& user, AppState* appState);
    void addNew(AppState* appState);
    void remove(realm::managed<realm::Item> itemToDelete);
    void markComplete(realm::managed<realm::Item> itemToMarkComplete);
    void refreshDatabase();
    void toggleOfflineMode(AppState* appState);
    realm::results<realm::Item> getItemList();
    realm::results<realm::Item> getIncompleteItemList();
    void toggleSubscriptions(AppState* appState);
};
