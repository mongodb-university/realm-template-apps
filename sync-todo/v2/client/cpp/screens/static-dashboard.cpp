#include "static-dashboard.hpp"

#include <iostream>

#include "ftxui/dom/elements.hpp"
#include "ftxui/dom/table.hpp"
#include "ftxui/screen/screen.hpp"
#include "ftxui/screen/string.hpp"

using namespace ftxui;

void StaticDashboard::init() {
  auto offlineMode = [&] {
    auto content = vbox({
        hbox({text(L"Enable   ") | bold}) | color(Color::Green),
        hbox({text(L"Enabled/Disabled ") | bold}) | color(Color::RedLight),
    });
    return window(text(L" Offline Mode "), content);
  };

  auto subscriptions = [&] {
    auto content = vbox({
        hbox({text(L"Show Only Mine   ") | bold}) | color(Color::Green),
    });
    return window(text(L" Subscriptions "), content);
  };

  auto filters = [&] {
    auto content = vbox({
        hbox({text(L"Hide Completed   ") | bold}) | color(Color::Green),
    });
    return window(text(L" Filters "), content);
  };

  auto logout = [&] {
    auto content = vbox({
        hbox({text(L"Logout   ") | bold}) | color(Color::Green),
    });
    return window(text(L" Auth "), content);
  };

  auto taskRow = [&] {
    return hbox({
        text(L"  Completed ") | bold,
        text(L"  Summary ") | flex,
        text(L"  Mine  "),
        text(L"  Delete ") | bold,
    });
    // return window(text(L" New Task "), content);
  };

  auto taskList = [&] {
    auto content = vbox({
        taskRow(),
        taskRow(),
        taskRow(),
    });
    return window(text(L" Task List "), content);
  };

  auto taskTable = Table({
      {"Completed", "Summary", "Mine", "Delete"},
      {"Complete", "Summary", "Mine", "Delete"},
      {"Incomplete", "Summary", "Theirs", ""},
      {"Incomplete", "Summary", "Mine", "Delete"},
  });

  auto newTask = [&] {
    auto content = hbox({
        text(L"  Completed ") | bold,
        text(L"  Summary ") | flex,
        text(L"  Save  "),
    });
    return window(text(L" New Task "), content);
  };

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

  auto document =  //
      vbox({
          hbox({
              offlineMode(),
              subscriptions(),
              filters(),
              logout() | flex,
          }),
          taskList(),
          newTask(),
          taskCounts(),
      });

  // auto document = taskTable.Render();

  // Limit the size of the document to 80 char.
  document = document | size(WIDTH, LESS_THAN, 80);

  auto screen = Screen::Create(Dimension::Full(), Dimension::Fit(document));
  Render(screen, document);

  std::cout << screen.ToString() << '\0' << std::endl;
}