#pragma once

#include "ftxui/component/component.hpp"

class Controller {
 private:
  ftxui::Component _component;

 public:
  Controller(): Controller(ftxui::Container::Stacked({})) {}
  Controller(ftxui::Component component): _component(component) {}
  virtual ~Controller() = 0;

  ftxui::Component component() {
    return _component;
  }
};

Controller::~Controller() = default;