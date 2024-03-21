#include "error_manager.hpp"

//ErrorManager::ErrorManager(ErrorManager::Listener *listener): _listener(listener) {}
//
//void ErrorManager::setError(std::string error) {
//  _error = std::move(error);
//  _listener->onError(*this);
//}
//
//void ErrorManager::clearError() {
//  _error.reset();
//  _listener->onErrorCleared(*this);
//}
//
//std::optional<std::string> const &ErrorManager::getError() const {
//  return _error;
//}
