#pragma once

#include <string>

#include "ftxui/component/captured_mouse.hpp"  // for ftxui
#include "ftxui/component/component.hpp"       // for Input, Renderer, Vertical
#include "ftxui/component/screen_interactive.hpp"  // for Component, ScreenInteractive
#include "ftxui/dom/elements.hpp"  // for text, hbox, separator, Element, operator|, vbox, border

#include "../data/app-state.hpp"
#include "display-screen.hpp"

class ErrorModal {
private:
    ftxui::Component okButton;
    ftxui::Component buttonLayout;
public:
    ftxui::Component init(AppState* appState);
    static void dismissErrorMessage(AppState* appState);
};