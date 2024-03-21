#pragma once

#include <string>
#include <cpprealm/sdk.hpp>
#include "../app_state.hpp"
#include "../database_state.hpp"
#include "../item.hpp"
#include "../ss.hpp"

class ItemManager {
 private:
  std::string allItemSubscriptionName;
  std::string myItemSubscriptionName;
  std::unique_ptr<realm::db> databasePtr;
  std::string userId;

 public:
  void init(realm::user& user, AppState* appState);
  void addNew(DatabaseState* databaseState);
  void remove(realm::managed<realm::Item> itemToDelete);
  void markComplete(realm::managed<realm::Item> itemToMarkComplete);
  void refreshDatabase();
  void toggleOfflineMode(DatabaseState* databaseState);
  realm::results<realm::Item> getItemList();
  realm::results<realm::Item> getIncompleteItemList();
  void toggleSubscriptions(DatabaseState* databaseState);
};