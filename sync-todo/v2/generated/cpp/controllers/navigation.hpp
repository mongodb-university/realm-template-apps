#ifndef NAVIGATION_HPP
#define NAVIGATION_HPP

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

#endif
