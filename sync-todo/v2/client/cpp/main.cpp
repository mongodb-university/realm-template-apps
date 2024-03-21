#include "ftxui/component/screen_interactive.hpp"
#include "controllers/app_controller.hpp"
#include <ftxui/component/loop.hpp>

int main() {
  // Initialize render destination
  auto screen = ftxui::ScreenInteractive::Fullscreen();

  AppController appController(&screen);

  // Declare loop that handles events and renders the component to the screen
  ftxui::Loop loop(&screen, appController.component());

  while (!loop.HasQuitted()) {
    appController.onFrame();
    loop.RunOnce();
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
  }
}