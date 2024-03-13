#include <cpprealm/sdk.hpp>
#include <iostream>

#include "ftxui/component/component.hpp"  // for Checkbox, Renderer, Horizontal, Vertical, Input, Menu, Radiobox, ResizableSplitLeft, Tab
#include "ftxui/component/screen_interactive.hpp"  // for Component, ScreenInteractive
#include "ftxui/dom/elements.hpp"  // for text, color, operator|, bgcolor, filler, Element, vbox, size, hbox, separator, flex, window, graph, EQUAL, paragraph, WIDTH, hcenter, Elements, bold, vscroll_indicator, HEIGHT, flexbox, hflow, border, frame, flex_grow, gauge, paragraphAlignCenter, paragraphAlignJustify, paragraphAlignLeft, paragraphAlignRight, dim, spinner, LESS_THAN, center, yframe, GREATER_THAN
#include "ftxui/screen/color.hpp"  // for Color, Color::BlueLight, Color::RedLight, Color::Black, Color::Blue, Color::Cyan, Color::CyanLight, Color::GrayDark, Color::GrayLight, Color::Green, Color::GreenLight, Color::Magenta, Color::MagentaLight, Color::Red, Color::White, Color::Yellow, Color::YellowLight, Color::Default, Color::Palette256, ftxui

#include "./data/auth-manager.hpp"
#include "./screens/authentication.hpp"
#include "./screens/options.hpp"
//#include "./screens/item-list.hpp"
#include "./data/item-manager.hpp"
#include "./screens/scroller.hpp"
#include "./screens/error-modal.hpp"
#include "display-screen.hpp"
#include "./data/subscription-selection.hpp"

Options g_options;
Authentication g_authentication;
//ItemList g_itemList;
ItemManager itemManager;
ErrorModal g_errorModal;

auto APP_ID = "INSERT-YOUR-APP-ID-HERE";

int main() {
    std::string newTaskSummary;
    std::string errorMessage;
    auto newTaskIsComplete = false;

    auto appConfig = realm::App::configuration {
        .app_id = APP_ID
    };
    auto app = std::make_shared<realm::App>(appConfig);
    auto authManager =
            std::make_shared<AuthManager>(app);

    // For most startups, we will already have a logged-in user on the device,
    // so assume no modal and go right to the dashboard.
    int displayScreen = DisplayScreen::dashboardComponent;
    auto errorModal = g_errorModal.init(&errorMessage, &displayScreen);

    // What's the right pattern to re-check this after logging in for the first time?
    auto currentUser = app->get_current_user();

    auto screen = ftxui::ScreenInteractive::FitComponent();

    int subscriptionSelection = SubscriptionSelection::allItems;
    auto optionsWindow = g_options.init(authManager, screen, &subscriptionSelection);
    auto authModal = g_authentication.init(authManager);

    auto dashboardContainer = ftxui::Container::Vertical({
                                                                 optionsWindow,
                                                         });

    auto dashboardRenderer = Renderer(dashboardContainer, [=] {
        auto content = ftxui::vbox({
                                           optionsWindow->Render(),
                                   });
        return window(ftxui::text(L" Todo Tracker "), content);
    });

    if (currentUser.has_value() && currentUser->is_logged_in()) {
        auto& user = *currentUser;
        //auto itemWindow = g_itemList.init(user, 1, 0);

        itemManager.init(&user, &subscriptionSelection, 0, &errorMessage, &displayScreen);

        //std::string newTaskSummary;
        auto inputNewTaskSummary =
                ftxui::Input(&newTaskSummary, "Enter new task summary");

        //auto newTaskIsComplete = false;
        auto newTaskCompletionStatus = ftxui::Checkbox("Complete", &newTaskIsComplete);

        auto saveButton = ftxui::Button("Save", [&] {
            itemManager.addNew(newTaskSummary, newTaskIsComplete, user.identifier());
            newTaskSummary = "";
        });

        auto newTaskLayout = ftxui::Container::Horizontal(
                {inputNewTaskSummary, newTaskCompletionStatus, saveButton});

        // Lay out and render scrollable task list
        // Shared pointer to items
        auto itemList = itemManager.getItemList();

        auto renderTasks = ftxui::Renderer([=]() mutable {
            ftxui::Elements tasks;
            for (auto &item: itemList) {
                std::string completionString = (item.isComplete) ? " Complete " : " Incomplete ";
                std::string mineOrNot = (item.owner_id == user.identifier()) ? " Mine " : " Them ";
                auto taskRow = ftxui::hbox({
                                                   ftxui::text(item.summary) | ftxui::flex,
                                                   align_right(ftxui::text(completionString)),
                                                   align_right(ftxui::text(mineOrNot))
                                           }) | size(ftxui::WIDTH, ftxui::GREATER_THAN, 80);
                tasks.push_back(taskRow);
            }
            auto content = vbox(std::move(tasks));
            return content;
        });

        auto scroller = Scroller(renderTasks);

        auto scrollerRenderer = Renderer(scroller, [=] {
            return ftxui::vbox({
                                       scroller->Render() | ftxui::flex,
                               });
        });

        auto scrollerContainer = scrollerRenderer;
        scrollerContainer =
                Renderer(scrollerContainer, [=] { return scrollerContainer->Render() | ftxui::flex; });

        // Handle keyboard events.
        scrollerContainer = CatchEvent(scrollerContainer, [=](ftxui::Event const &event) mutable {
            // Delete items from the database
            if (event == ftxui::Event::Character('d')) {
                // Get index of selected item in the scroller
                auto scrollerIndex = scroller->getScrollerIndex();
                // Get the matching managed Item from the Results set
                auto managedItemAtIndex = itemList[scrollerIndex];
                // Delete the item from the database
                itemManager.remove(managedItemAtIndex);
                return true;
            }

            // Mark items complete
            if (event == ftxui::Event::Character('c')) {
                auto scrollerIndex = scroller->getScrollerIndex();
                auto managedItemAtIndex = itemList[scrollerIndex];
                itemManager.markComplete(managedItemAtIndex);
                return true;
            }
            return false;
        });

        // Lay out and render the dashboard
        ftxui::Element taskTableHeaderRow = ftxui::hbox({
                                                                ftxui::text(L" Summary ") | ftxui::flex | ftxui::bold,
                                                                align_right(ftxui::text(L" Status ")),
                                                                align_right(ftxui::text(L" Owner ")),
                                                        });

        auto itemListLayout = ftxui::Container::Vertical({
                                                             newTaskLayout, scrollerContainer
                                                     });

        auto itemListRenderer = Renderer(itemListLayout, [=] {
            auto content =
                    ftxui::vbox({
                                        ftxui::hbox({
                                                            inputNewTaskSummary->Render() | ftxui::flex,
                                                            newTaskCompletionStatus->Render() | ftxui::center,
                                                            saveButton->Render(),
                                                    }) | size(ftxui::WIDTH, ftxui::GREATER_THAN, 80),
                                        ftxui::separator(),
                                        taskTableHeaderRow,
                                        ftxui::separator(),
                                        scrollerContainer->Render(),
                                        ftxui::separator(),
                                        ftxui::text("In the list, press 'c' to mark the selected item complete, 'd' to delete"),
                                }) | ftxui::center;
            return window(ftxui::text(L" Todo List "), content);
        });

        dashboardContainer = ftxui::Container::Vertical({
                                                                     optionsWindow,
                                                                     itemListLayout
                                                             });

        dashboardRenderer = Renderer(dashboardContainer, [=] {
            auto content = ftxui::vbox({
                                               optionsWindow->Render(),
                                               itemListRenderer->Render()
                                       });
            return window(ftxui::text(L" Todo Tracker "), content);
        });
    } else {
        // Do show modal because there is no logged-in user
        displayScreen = authModalComponent;
    }

    auto main_container = ftxui::Container::Tab(
            {
                    dashboardContainer,
                    authModal,
                    errorModal
            },
            &displayScreen);

    auto main_renderer = Renderer(main_container, [&] {
        ftxui::Element document = optionsWindow->Render();
        if (currentUser.has_value()) {
            document = dashboardRenderer->Render();
        };

        if (!currentUser.has_value() || !currentUser->is_logged_in()) {
            displayScreen = authModalComponent;
        } else {
            displayScreen = dashboardComponent;
        }
        if (displayScreen == authModalComponent) {
            document = ftxui::dbox({
                                    document,
                                    authModal->Render() | ftxui::clear_under | ftxui::center,
                            });
        } else if (displayScreen == errorModalComponent) {
            document = ftxui::dbox({
                document,
                errorModal->Render() | ftxui::clear_under | ftxui::center,
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
