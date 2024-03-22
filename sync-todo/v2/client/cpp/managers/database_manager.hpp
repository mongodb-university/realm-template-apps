#pragma once

#include <string>
#include <cpprealm/sdk.hpp>
#include "../app_state.hpp"
#include "../database_state.hpp"
#include "../item.hpp"
#include "../ss.hpp"

class DatabaseManager {
 public:
  DatabaseManager(AppState *appState);

  void init(AppState* appState);
  void addNew();
  void remove(realm::managed<realm::Item> itemToDelete);
  void markComplete(realm::managed<realm::Item> itemToMarkComplete);
  void refreshDatabase();
  void toggleOfflineMode();
  realm::results<realm::Item> getItemList();
  realm::results<realm::Item> getIncompleteItemList();
  void toggleSubscriptions();
 private:
  std::string allItemSubscriptionName;
  std::string myItemSubscriptionName;
  std::unique_ptr<realm::db> databasePtr{nullptr};
  std::string userId;
  AppState *_appState;
};