#pragma once

#include <string>

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
#include "authentication.hpp"

class Options {
private:
    int offlineModeSelection;
    std::vector<std::string> offlineModeOptions;
    ftxui::Component offlineMode;
    int subscriptionSelection;
    std::vector<std::string> subscriptionOptions;
    ftxui::Component subscriptionToggle;
    bool hideCompletedSelected;
    ftxui::Component filters;
    std::string logoutButtonLabel;
    ftxui::Component logoutButton;
    std::string quitButtonLabel;
    ftxui::Component quitButton;
    ftxui::Component optionsLayout;
 public:
  ftxui::Component init(std::shared_ptr<AuthManager> g_auth_manager, ftxui::ScreenInteractive& screen);
};