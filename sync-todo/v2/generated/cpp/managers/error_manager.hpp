#ifndef ERROR_MANAGER_HPP
#define ERROR_MANAGER_HPP

#include <string>
#include <optional>

class ErrorManager {
 public:
  struct Delegate {
    virtual ~Delegate() = default;
    virtual void onError(ErrorManager &error) = 0;
    virtual void onErrorCleared(ErrorManager &error) = 0;
  };

  explicit ErrorManager(Delegate *delegate);
  void setError(std::string error);
  void clearError();
  [[nodiscard]] std::optional<std::string> const &getError() const;

 private:
  Delegate *_delegate{nullptr};
  std::optional<std::string> _error;
};

#endif
