#include "item-list.hpp"

ftxui::Component ItemList::init(realm::user* mUser, int* subscriptionSelection, int* offlineModeSelection) {
    std::string errorMessage;
    int depth = 0;
    itemManager.init(mUser, subscriptionSelection, offlineModeSelection, &errorMessage, &depth);

    inputNewTaskSummary =
            ftxui::Input(&newTaskSummary, "Enter new task summary");

    newTaskIsComplete = false;
    newTaskCompletionStatus = ftxui::Checkbox("Complete", &newTaskIsComplete);

    saveButtonLabel = "Save";
    saveButton = ftxui::Button(&saveButtonLabel, [&] {
            itemManager.addNew(newTaskSummary, newTaskIsComplete, mUser->identifier());
            newTaskSummary = "";
    });

    newTaskLayout = ftxui::Container::Horizontal(
            {inputNewTaskSummary, newTaskCompletionStatus, saveButton});

    // Lay out and render scrollable task list
    // Shared pointer to items
    auto itemList = itemManager.getItemList();

    renderTasks = ftxui::Renderer([&] {
        ftxui::Elements tasks;
        for (auto const &item: itemList) {
            std::string completionString = (item.isComplete) ? " Complete " : " Incomplete ";
            std::string mineOrNot = (item.owner_id == mUser->identifier()) ? " Mine " : " Them ";
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

    scroller = Scroller(renderTasks);

    scrollerRenderer = Renderer(scroller, [&] {
        return ftxui::vbox({
                            scroller->Render() | ftxui::flex,
                    });
    });

    scrollerContainer = scrollerRenderer;
    scrollerContainer =
            Renderer(scrollerContainer, [&] { return scrollerContainer->Render() | ftxui::flex; });

    // Handle keyboard events.
    scrollerContainer = CatchEvent(scrollerContainer, [&](ftxui::Event const &event) {
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

    dashboardLayout = ftxui::Container::Vertical({
                                                  newTaskLayout, scrollerContainer
                                               });

    mainRenderer = Renderer(dashboardLayout, [&] {
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
//                             ftxui::separator(),
//                             ftxui::hbox({
//                                ftxui::vbox({ftxui::text(L" Completed   "), ftxui::text(std::to_string(itemManager.completedItemCount)) | ftxui::bold}) |
//                                color(ftxui::Color::Green),
//                                ftxui::vbox({ftxui::text(L" My Tasks    "), ftxui::text(std::to_string(itemManager.myItemCount)) | ftxui::bold}) |
//                                color(ftxui::Color::BlueLight),
//                                ftxui::vbox({ftxui::text(L" All Tasks   "), ftxui::text(std::to_string(itemManager.itemCount)) | ftxui::bold}) |
//                                color(ftxui::Color::YellowLight),
//                                ftxui::vbox({ftxui::text(L" Incomplete   "), ftxui::text(std::to_string(itemManager.incompleteItemCount)) | ftxui::bold}) |
//                                color(ftxui::Color::YellowLight),
//                                })
                     }) | ftxui::center;
        return window(ftxui::text(L" Todo List "), content);
    });
    return mainRenderer;
}
