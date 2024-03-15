#pragma once

#include <cpprealm/sdk.hpp>

class AuthManager {
private:
    std::shared_ptr<realm::App> _app;

public:
    explicit AuthManager(std::shared_ptr<realm::App> app);
    void registerAndLoginUser(std::string const& userEmail, std::string const& userPassword);
    void loginUser(std::string const& userEmail, std::string const& userPassword);
    void logoutUser();
};
