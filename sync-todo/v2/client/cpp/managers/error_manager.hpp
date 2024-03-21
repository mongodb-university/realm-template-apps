#pragma once

#include <string>
#include <optional>

class ErrorManager {
 public:
  struct Delegate {
    virtual ~Delegate() = default;
    virtual void onError(ErrorManager &error) = 0;
    virtual void onErrorCleared(ErrorManager &error) = 0;
  };

  ErrorManager(Delegate *delegate): _delegate(delegate) {}

  void setError(std::string error) {
    _error = std::move(error);
    _delegate->onError(*this);
  }

  void clearError() {
    _error.reset();
    _delegate->onErrorCleared(*this);
  }

  std::optional<std::string> const &getError() const {
    return _error;
  }

 private:
  Delegate *_delegate{nullptr};
  std::optional<std::string> _error;
};