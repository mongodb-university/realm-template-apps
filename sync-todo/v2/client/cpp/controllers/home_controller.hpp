#ifndef HOME_CONTROLLER_HPP
#define HOME_CONTROLLER_HPP

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../managers/database_manager.hpp"
#include "../state/app_state.hpp"
#include "../state/home_controller_state.hpp"
#include "../views/scroller.hpp"
#include "../ss.hpp"

class HomeController final : public Controller, public DatabaseManager::Delegate {
 public:

  explicit HomeController(AppState *appState);

  void onFrame() override;

 private:
  AppState *_appState{nullptr};
  HomeControllerState _homeControllerState;
  DatabaseManager _dbManager;

  void onSyncSessionPaused() override;
  void onSyncSessionResumed() override;
  void onSubscriptionSelectionMyItems() override;
  void onSubscriptionSelectionAllItems() override;
  SubscriptionSelection getSubscriptionSelection() override;
};

#endif
