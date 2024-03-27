#include "ftxui/component/screen_interactive.hpp"
#include "controllers/app_controller.hpp"
#include <ftxui/component/loop.hpp>

int main(int argc, const char **argv) {
  if (argc <= 1) {
    printf("\nPlease pass the path to atlasConfig.json when running the application. \n");
    return 1;
  }

  // Get the path to the Atlas config
  auto pathToAtlasConfig = std::string{argv[1]};

  // Initialize render destination
  auto screen = ftxui::ScreenInteractive::FitComponent();
  AppController appController(&screen, pathToAtlasConfig);

  // Declare loop that handles events and renders the component to the screen
  ftxui::Loop loop(&screen, appController.component());

  while (!loop.HasQuitted()) {
    appController.onFrame();
    loop.RunOnce();
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
  }
}