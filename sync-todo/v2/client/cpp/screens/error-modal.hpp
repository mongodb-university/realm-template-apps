#pragma once

#include <string>
#include "ftxui/component/captured_mouse.hpp"  // for ftxui
#include "ftxui/component/component.hpp"       // for Input, Renderer, Vertical
#include "ftxui/component/screen_interactive.hpp"  // for Component, ScreenInteractive
#include "ftxui/dom/elements.hpp"  // for text, hbox, separator, Element, operator|, vbox, border

#include "display-screen.hpp"

class ErrorModal {
private:
    ftxui::Component okButton;
    ftxui::Component buttonLayout;
public:
    ftxui::Component init(std::string* errorMessage, int* displayScreen);
    static void dismissErrorMessage(std::string* errorMessage, int* displayScreen);
};