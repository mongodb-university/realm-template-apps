#include "navigation.hpp"

Navigation::Navigation(): Controller(ftxui::Container::Vertical({})) {}

void Navigation::onFrame() {
  if (_currentController) {
    _currentController->onFrame();
  }
}

void Navigation::goTo(std::unique_ptr<Controller> controller) {
  component()->DetachAllChildren();
  _currentController = std::move(controller);
  component()->Add(_currentController->component());
}