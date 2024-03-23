#include "error_manager.hpp"

ErrorManager::ErrorManager(Delegate *delegate): _delegate(delegate) {}

void ErrorManager::setError(std::string error) {
  _error = std::move(error);
  _delegate->onError(*this);
}

void ErrorManager::clearError() {
  _error.reset();
  _delegate->onErrorCleared(*this);
}

std::optional<std::string> const &ErrorManager::getError() const {
  return _error;
}
