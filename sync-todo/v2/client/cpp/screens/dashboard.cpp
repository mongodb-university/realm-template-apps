#include "dashboard.hpp"

#include "ftxui/component/component.hpp"  // for Checkbox, Renderer, Horizontal, Vertical, Input, Menu, Radiobox, ResizableSplitLeft, Tab
#include "ftxui/component/component_base.hpp"  // for ComponentBase, Component
#include "ftxui/component/component_options.hpp"  // for MenuOption, InputOption
#include "ftxui/component/event.hpp"              // for Event, Event::Custom
#include "ftxui/component/screen_interactive.hpp"  // for Component, ScreenInteractive
#include "ftxui/dom/elements.hpp"  // for text, color, operator|, bgcolor, filler, Element, vbox, size, hbox, separator, flex, window, graph, EQUAL, paragraph, WIDTH, hcenter, Elements, bold, vscroll_indicator, HEIGHT, flexbox, hflow, border, frame, flex_grow, gauge, paragraphAlignCenter, paragraphAlignJustify, paragraphAlignLeft, paragraphAlignRight, dim, spinner, LESS_THAN, center, yframe, GREATER_THAN
#include "ftxui/dom/flexbox_config.hpp"  // for FlexboxConfig
#include "ftxui/dom/node.hpp"
#include "ftxui/screen/color.hpp"  // for Color, Color::BlueLight, Color::RedLight, Color::Black, Color::Blue, Color::Cyan, Color::CyanLight, Color::GrayDark, Color::GrayLight, Color::Green, Color::GreenLight, Color::Magenta, Color::MagentaLight, Color::Red, Color::White, Color::Yellow, Color::YellowLight, Color::Default, Color::Palette256, ftxui
#include "ftxui/screen/color_info.hpp"  // for ColorInfo
#include "ftxui/screen/screen.hpp"      // for Size, Dimensions
#include "ftxui/screen/terminal.hpp"    // for Size, Dimensions

using namespace ftxui;

Component HWrap(std::string name, Component component) {
  return Renderer(component, [name, component] {
    return hbox({
               text(name) | size(WIDTH, EQUAL, 8),
               separator(),
               component->Render() | xflex,
           }) |
           xflex;
  });
}

Component VWrap(std::string name, Component component) {
  return Renderer(component, [name, component] {
    return vbox({
        hbox(text(name)) | hcenter | size(WIDTH, EQUAL, 18),
        separator(),
        component->Render() | hcenter,
    });
  });
}

// Component TaskRow(bool isComplete, std::string summary, bool isMine) {
//   return Renderer(
//       {hbox(text(summary)) | hcenter | size(WIDTH, EQUAL, 18), separator()});
// };

void Dashboard::init() {
  auto screen = ScreenInteractive::FitComponent();

  int offlineModeSelection = 0;
  std::vector<std::string> offlineModeOptions = {
      "Enabled ",
      "Disabled",
  };
  Component offlineMode = Toggle(&offlineModeOptions, &offlineModeSelection);
  offlineMode = VWrap("Offline Mode", offlineMode);

  int subscriptionSelection = 0;
  std::vector<std::string> subscriptionOptions = {
      "My Tasks",
      "All Tasks",
  };
  Component subscriptions =
      Toggle(&subscriptionOptions, &subscriptionSelection);
  subscriptions = VWrap("Subscriptions", subscriptions);

  bool hideCompletedSelected = false;
  auto filters = Checkbox("Hide completed", &hideCompletedSelected);
  filters = VWrap("Filters", filters);

  std::string logoutButtonLabel = "Logout";
  std::function<void()> onLogoutButtonClicked;
  auto logoutButton = Button(&logoutButtonLabel, screen.ExitLoopClosure());
  logoutButton = VWrap("Auth", logoutButton);

  std::string quitButtonLabel = "Quit";
  std::function<void()> onQuitButtonClicked;
  auto quitButton = Button(&quitButtonLabel, screen.ExitLoopClosure());
  quitButton = VWrap("Exit", quitButton);

  //   auto component = Renderer(options, [&] {
  //     return vbox({
  //                optionBox,
  //            }) |
  //            xflex | size(WIDTH, GREATER_THAN, 60) | border;
  //   });

  auto firstRow = Container::Horizontal(
      {offlineMode, subscriptions, filters, logoutButton, quitButton});

  auto taskRow = hbox({
      text(L"  Completed ") | bold,
      text(L"  Summary ") | flex,
      text(L"  Mine  "),
      text(L"  Delete ") | bold,
  });

  auto taskList = window(text(L" Task List "), {vbox({taskRow})});

  std::string newTaskSummary;
  Component inputNewTaskSummary =
      Input(&newTaskSummary, "Enter new task summary");

  bool newTaskIsComplete = false;
  auto newTaskCompletionStatus = Checkbox("Complete", &newTaskIsComplete);

  std::string saveButtonLabel = "Save";
  std::function<void()> onSaveButtonClicked;
  auto saveButton = Button(&saveButtonLabel, screen.ExitLoopClosure());

  auto newTask = Container::Horizontal(
      {inputNewTaskSummary, newTaskCompletionStatus, saveButton});

  auto taskCounts = [&] {
    auto content = hbox({
        vbox({text(L" Completed   "), text(L"     3") | bold}) |
            color(Color::Green),
        vbox({text(L" My Tasks    "), text(L"     2") | bold}) |
            color(Color::RedLight),
        vbox({text(L" All Tasks   "), text(L"     9") | bold}) |
            color(Color::Red),
    });
    return window(text(L" Task Counts "), content);
  };

  auto dashboardContainer = Container::Vertical({firstRow, newTask});

  auto renderer = Renderer(dashboardContainer, [&] {
    return vbox(
        hbox(offlineMode->Render(), separator(), subscriptions->Render(),
             separator(), filters->Render(), separator(),
             logoutButton->Render(), separator(), quitButton->Render()) |
            border,
        taskList,
        hbox(inputNewTaskSummary->Render() | vcenter, filler(),
             newTaskCompletionStatus->Render() | vcenter,
             saveButton->Render()) |
            border,
        taskCounts());
  });

  screen.Loop(renderer);
}