#include <cpprealm/sdk.hpp>
#include <iostream>

#include "ftxui/component/component.hpp"  // for Checkbox, Renderer, Horizontal, Vertical, Input, Menu, Radiobox, ResizableSplitLeft, Tab
#include "ftxui/component/screen_interactive.hpp"  // for Component, ScreenInteractive
#include "ftxui/dom/elements.hpp"  // for text, color, operator|, bgcolor, filler, Element, vbox, size, hbox, separator, flex, window, graph, EQUAL, paragraph, WIDTH, hcenter, Elements, bold, vscroll_indicator, HEIGHT, flexbox, hflow, border, frame, flex_grow, gauge, paragraphAlignCenter, paragraphAlignJustify, paragraphAlignLeft, paragraphAlignRight, dim, spinner, LESS_THAN, center, yframe, GREATER_THAN
#include "ftxui/screen/color.hpp"  // for Color, Color::BlueLight, Color::RedLight, Color::Black, Color::Blue, Color::Cyan, Color::CyanLight, Color::GrayDark, Color::GrayLight, Color::Green, Color::GreenLight, Color::Magenta, Color::MagentaLight, Color::Red, Color::White, Color::Yellow, Color::YellowLight, Color::Default, Color::Palette256, ftxui

#include "./data/auth-manager.hpp"
#include "./screens/authentication.hpp"
#include "./screens/options.hpp"
#include "./screens/item-list.hpp"

Options g_options;
Authentication g_authentication;
ItemList g_itemList;

auto APP_ID = "INSERT-YOUR-APP-ID-HERE";

int main() {
    auto appConfig = realm::App::configuration();
    appConfig.app_id = APP_ID;
    auto app = std::make_shared<realm::App>(appConfig);
    std::shared_ptr<AuthManager> g_auth_manager =
            std::make_shared<AuthManager>(app);

    // Depth controls whether a modal is displayed over the main dashboard.
    // For most startups, we will already have a logged-in user on the device,
    // so assume no modal and go right to the dasbhoard.
    // 0 = dashboard
    // 1 = authModal
    // TODO: 2 = errorModal
    int depth = 0;

    // What's the right pattern to re-check this after logging in for the first time?
    auto currentUser = app->get_current_user();

    auto screen = ftxui::ScreenInteractive::FitComponent();
    auto optionsWindow = g_options.init(g_auth_manager, screen);
    auto authModal = g_authentication.init(g_auth_manager);

    auto dashboardContainer = ftxui::Container::Vertical({
                                                                 optionsWindow,
                                                         });

    auto dashboardRenderer = Renderer(dashboardContainer, [&] {
        auto content = ftxui::vbox({
                                           optionsWindow->Render(),
                                   });
        return window(ftxui::text(L" Todo Tracker "), content);
    });

    if (currentUser.has_value() && currentUser->is_logged_in()) {
        auto& user = *currentUser;
        auto itemWindow = g_itemList.init(user, 0, 0);
        dashboardContainer = ftxui::Container::Vertical({
                                                                     optionsWindow,
                                                                     itemWindow
                                                             });

        dashboardRenderer = Renderer(dashboardContainer, [&] {
            auto content = ftxui::vbox({
                                               optionsWindow->Render(),
                                               itemWindow->Render()
                                       });
            return window(ftxui::text(L" Todo Tracker "), content);
        });
    } else {
        // Do show modal because there is no logged-in user
        depth = 1;
    }

    auto main_container = ftxui::Container::Tab(
            {
                    dashboardContainer,
                    authModal,
            },
            &depth);

    auto main_renderer = Renderer(main_container, [&] {
        ftxui::Element document = optionsWindow->Render();
        if (currentUser.has_value()) {
            document = dashboardRenderer->Render();
        };

        if (!currentUser.has_value() || !currentUser->is_logged_in()) {
            depth = 1;
        } else {
            depth = 0;
        }
        if (depth == 1) {
            document = ftxui::dbox({
                                    document,
                                    authModal->Render() | ftxui::clear_under | ftxui::center,
                            });
        }
        return document;
    });

    try {
        screen.Loop(main_renderer);
    } catch(...) {
        std::cout << "The app crashed with an error." << std::endl;
    }
    return 0;
}
