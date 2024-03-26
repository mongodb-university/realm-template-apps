#pragma once

#include <string>
#include <cpprealm/sdk.hpp>
#include "../state/app_state.hpp"
#include "../state/home_controller_state.hpp"
#include "../state/item.hpp"
#include "../ss.hpp"

class DatabaseManager {
 public:
  DatabaseManager(AppState *appState, HomeControllerState *homeControllerState);

  void addNew(bool newItemIsComplete, std::string newItemSummary);
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
  std::unique_ptr<realm::db> databasePtr;
  std::string userId;
  AppState *_appState;
  HomeControllerState *_homeControllerState;
};