#include "app_controller.hpp"

void AppController::onFrame() {
  _navigation.onFrame();
}

AppController::AppController(ftxui::ScreenInteractive *screen, std::string const& pathToAtlasConfig) {
  _appState.screen = screen;

  // Read the contents of the atlasConfig.json to get the metadata for the App Services App.
  std::ifstream f(pathToAtlasConfig);
  nlohmann::json data = nlohmann::json::parse(f);
  auto appConfigMetadata = data.template get<AppConfigMetadata>();
  f.close();

  auto appConfig = realm::App::configuration {
      .app_id = appConfigMetadata.appId
  };
  _appState.app = std::make_unique<realm::App>(appConfig);
  _appState.authManager = std::make_unique<AuthManager>(this, _appState.app.get());
  _appState.errorManager = std::make_unique<ErrorManager>(this);
  _appState.appConfigMetadata = appConfigMetadata;

  _errorModal = ftxui::Container::Vertical({
    ftxui::Renderer([this] {
      return ftxui::text(_appState.errorManager->getError().value());
    }),
    ftxui::Button("Dismiss", [=] {
      _appState.errorManager->clearError();
    }),
  });

  component()->Add(_navigation.component());

  if (_appState.app->get_current_user()) {
    _navigation.goTo(std::make_unique<HomeController>(&_appState));
  } else {
    _navigation.goTo(std::make_unique<LoginController>(&_appState));
  }
}

void AppController::onLoggedIn() {
  _navigation.goTo(std::make_unique<HomeController>(&_appState));
}

void AppController::onLoggedOut() {
  _navigation.goTo(std::make_unique<LoginController>(&_appState));
}

void AppController::onError(ErrorManager &error) {
  _errorModal->Detach();
  component()->Add(_errorModal);
  _errorModal->TakeFocus();
}

void AppController::onErrorCleared(ErrorManager &error) {
  _errorModal->Detach();
}