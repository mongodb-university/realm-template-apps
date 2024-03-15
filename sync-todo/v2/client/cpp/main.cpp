#include <cpprealm/sdk.hpp>
#include <iostream>
#include <fstream>

#include <ftxui/component/loop.hpp>
#include "ftxui/component/component.hpp"  // for Checkbox, Renderer, Horizontal, Vertical, Input, Menu, Radiobox, ResizableSplitLeft, Tab
#include "ftxui/component/screen_interactive.hpp"  // for Component, ScreenInteractive
#include "ftxui/dom/elements.hpp"  // for text, color, operator|, bgcolor, filler, Element, vbox, size, hbox, separator, flex, window, graph, EQUAL, paragraph, WIDTH, hcenter, Elements, bold, vscroll_indicator, HEIGHT, flexbox, hflow, border, frame, flex_grow, gauge, paragraphAlignCenter, paragraphAlignJustify, paragraphAlignLeft, paragraphAlignRight, dim, spinner, LESS_THAN, center, yframe, GREATER_THAN
#include "ftxui/screen/color.hpp"  // for Color, Color::BlueLight, Color::RedLight, Color::Black, Color::Blue, Color::Cyan, Color::CyanLight, Color::GrayDark, Color::GrayLight, Color::Green, Color::GreenLight, Color::Magenta, Color::MagentaLight, Color::Red, Color::White, Color::Yellow, Color::YellowLight, Color::Default, Color::Palette256, ftxui

#include <nlohmann/json.hpp>

#include "data/app-config-metadata.hpp"
#include "data/app-state.hpp"
#include "data/auth-manager.hpp"
#include "data/item-manager.hpp"
#include "screens/authentication.hpp"
#include "screens/error-modal.hpp"
#include "screens/options.hpp"
#include "screens/scroller.hpp"

static ItemManager itemManager;

int main() {
    /* Read the contents of the atlasConfig.json to get the metadata for the App Services App.
     * This path assumes you are running the app from a `/build` directory within this project. If you're
     * running the app somewhere else, update the path to your atlasConfig.json accordingly. */
    std::ifstream f("../atlasConfig.json");
    nlohmann::json data = nlohmann::json::parse(f);
    auto appConfigMetadata = data.template get<AppConfigMetadata>();
    f.close();

    // Refer to `AppState` for descriptions of these fields.
    auto appState = AppState {
      .newTaskSummary = "",
      .newTaskIsComplete = false,
      .errorMessage = "",
      .hideCompletedTasks = false,
      .subscriptionSelection = SubscriptionSelection::allItems,
      .offlineModeSelection = OfflineModeSelection::offlineModeDisabled,
      .customLoopCount = 0,
      .frameCount = 0,
      .eventCount = 0,
      .screenDisplaying = DisplayScreen::placeholderComponent,
      .screen = ftxui::ScreenInteractive::FitComponent()
    };

    auto appConfig = realm::App::configuration {
            .app_id = appConfigMetadata.appId
    };
    auto app = std::make_shared<realm::App>(appConfig);
    auto authManager =
            std::make_shared<AuthManager>(app);

    auto errorModal = ErrorModal().init(&appState);
    auto authModal = Authentication().init(authManager);

    // Populate a notLoggedInScreen when there is no logged-in user. The authentication modal will pop up
    // over this notLoggedInScreen.
    auto notLoggedInScreen =
            ftxui::vbox({
                                ftxui::text("Welcome to the Atlas Device SDK C++ Task Tracker"),
                                ftxui::text("Please log in or register a user to proceed.")
                        });

    notLoggedInScreen = notLoggedInScreen | size(ftxui::WIDTH, ftxui::GREATER_THAN, 80);

    auto notLoggedInContainer = ftxui::Container::Vertical({});
    auto notLoggedInRenderer = Renderer(notLoggedInContainer, [=] {
        auto content = ftxui::vbox({
                                           notLoggedInScreen,
                                   });
        return window(ftxui::text(L" Todo Tracker "), content);
    });

    auto dashboardContainer = ftxui::Container::Vertical({

                                                         });

    auto dashboardRenderer = Renderer(dashboardContainer, [=] {
        auto content = ftxui::vbox({
                                           notLoggedInScreen,
                                   });
        return window(ftxui::text(L" Todo Tracker "), content);
    });

    // If there is a logged-in user, render the scrollable task list.
    auto currentUser = app->get_current_user();
    if (currentUser.has_value() && currentUser->is_logged_in()) {
        auto& user = *currentUser;

        // The ItemManager handles all the database operations.
        //itemManager.init(user, &appState);
        itemManager.init(user, &appState);
        // The Options UI element contains most of the interactive elements to change app state.
        auto optionsWindow = Options().init(authManager, &itemManager, &appState);

        // The app uses these new task elements to accept user inputs and create new items in the database.
        auto inputNewTaskSummary =
                ftxui::Input(&appState.newTaskSummary, "Enter new task summary");
        auto newTaskCompletionStatus = ftxui::Checkbox("Complete", &appState.newTaskIsComplete);

        auto saveButton = ftxui::Button("Save", [&] {
            itemManager.addNew(&appState);
            appState.newTaskSummary = "";
        });

        auto newTaskLayout = ftxui::Container::Horizontal(
                {inputNewTaskSummary, newTaskCompletionStatus, saveButton});

        /// Lay out and render scrollable task list.
        auto renderTasks = ftxui::Renderer([&appState, &user] {
            auto itemList = appState.hideCompletedTasks? itemManager.getIncompleteItemList(): itemManager.getItemList();
            ftxui::Elements tasks;
            // If the user has toggled the checkbox to hide completed tasks, show only the incomplete task list.
            // Otherwise, show all items.
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

        // Render a scrollable task list that can accept keyboard events to mark items as complete or delete them.
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
        scrollerContainer = CatchEvent(scrollerContainer, [&appState, scroller](ftxui::Event const &event) {
            auto itemList = appState.hideCompletedTasks? itemManager.getIncompleteItemList(): itemManager.getItemList();
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
        // Show the auth modal because there is no logged-in user.
        appState.screenDisplaying = authModalComponent;
    }

    auto main_container = ftxui::Container::Tab(
            {
                    notLoggedInContainer,
                    dashboardContainer,
                    authModal,
                    errorModal
            },
            &appState.screenDisplaying);

    auto main_renderer = Renderer(main_container, [&appState, currentUser, dashboardRenderer, authModal, errorModal, notLoggedInRenderer] {
        appState.frameCount++;
        auto document = notLoggedInRenderer->Render();

        if (!currentUser.has_value() || !currentUser->is_logged_in()) {
            appState.screenDisplaying = authModalComponent;
        } else {
            appState.screenDisplaying = dashboardComponent;
        }

        if (appState.screenDisplaying == dashboardComponent) {
            document = dashboardRenderer->Render();
        } else if (appState.screenDisplaying == authModalComponent) {
            document = ftxui::dbox({
                                    document,
                                    authModal->Render() | ftxui::clear_under | ftxui::center,
                            });
        } else if (appState.screenDisplaying == errorModalComponent) {
            document = ftxui::dbox({
                document,
                errorModal->Render() | ftxui::clear_under | ftxui::center,
            });
        }
        return document;
    });

    main_renderer |= ftxui::CatchEvent([&](const ftxui::Event&) -> bool {
        appState.eventCount++;
        return false;
    });

    ftxui::Loop loop(&appState.screen, main_renderer);

    try {
        while (!loop.HasQuitted()) {
            appState.customLoopCount++;
            loop.RunOnce();
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
            if (currentUser.has_value() && currentUser->is_logged_in()) {
                itemManager.refreshDatabase();
            }
        }
    } catch(...) {
        std::cout << "The app crashed with an error." << std::endl;
    }
    return 0;
}
