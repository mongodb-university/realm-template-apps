#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"

class Navigation final : public Controller {
 private:
  std::unique_ptr<Controller> _currentController;

 public:
  Navigation();

  void onFrame() override;

  void goTo(std::unique_ptr<Controller> controller);
};