#pragma once

#include <iostream>
#include <cpprealm/sdk.hpp>
#include "ftxui/component/screen_interactive.hpp"

struct AppState {
    // The app uses these properties when creating a new task.
    std::string newTaskSummary;
    bool newTaskIsComplete;

    // The app uses these properties for Atlas Device SDK functionality.
    std::string errorMessage;
    // The app uses this to determine which item list to display - all items,
    // or an item list that only displays incomplete items.
    bool hideCompletedTasks;

    // The app uses this int with the `SubscriptionSelection` enum to determine
    // whether to subscribe to all items, or only the user's items.
    int subscriptionSelection;

    // The app uses this int with the `OfflineModeSelection` enum to determine
    // whether to immediately sync all changes, or simulate offline mode and stop syncing.
    int offlineModeSelection;

    // The app uses these properties with FTXUI to display and refresh the screen.
    // The FTXUI runloop uses these to update the screen with changes.
    int customLoopCount;
    int frameCount;
    int eventCount;

    // The app uses this int with the `DisplayScreen` enum to determine
    // what screen to show - the dashboard, or a modal overlay.
    int screenDisplaying;

    // FTXUI uses this to create an interactive screen for the TUI.
    ftxui::ScreenInteractive screen;
};