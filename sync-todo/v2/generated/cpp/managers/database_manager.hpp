#ifndef DATABASE_MANAGER_HPP
#define DATABASE_MANAGER_HPP

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
  void toggleSubscriptions();
  realm::results<realm::Item> getItemList();
  realm::results<realm::Item> getIncompleteItemList();

 private:
  std::string _allItemSubscriptionName;
  std::string _myItemSubscriptionName;
  std::unique_ptr<realm::db> _database;
  std::string _userId;
  AppState *_appState;
  HomeControllerState *_homeControllerState;
};

#endif
