#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"

class Navigation final : public Controller {
 private:
  std::unique_ptr<Controller> _currentController;

 public:
  Navigation(): Controller(ftxui::Container::Vertical({})) {}
  //Navigation();

  void onFrame() override {
    if (_currentController) {
      _currentController->onFrame();
    }
  }

  void goTo(std::unique_ptr<Controller> controller) {
    component()->DetachAllChildren();
    _currentController = std::move(controller);
    component()->Add(_currentController->component());
  }
};