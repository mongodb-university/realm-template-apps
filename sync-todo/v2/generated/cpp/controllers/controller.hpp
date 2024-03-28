#ifndef CONTROLLER_HPP
#define CONTROLLER_HPP

#include "ftxui/component/component.hpp"

class Controller {
 private:
  ftxui::Component _component;

 public:
  Controller(): Controller(ftxui::Container::Stacked({})) {}
  Controller(ftxui::Component component): _component(component) {}
  virtual ~Controller() = 0;
  virtual void onFrame() {}

  ftxui::Component component() {
    return _component;
  }
};

inline Controller::~Controller() = default;

#endif
