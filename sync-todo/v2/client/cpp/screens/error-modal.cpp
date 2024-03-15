#include "error-modal.hpp"

ftxui::Component ErrorModal::init(AppState* appState) {
    okButton = ftxui::Button("Dismiss", [appState]{ dismissErrorMessage(appState); });

    buttonLayout = ftxui::Container::Horizontal({ okButton });

    return Renderer(buttonLayout, [=] {
        auto content = ftxui::vbox({
                                   ftxui::hbox(ftxui::text(appState->errorMessage) | ftxui::hcenter),
                                   okButton->Render()
                           }) |
               ftxui::xflex | size(ftxui::WIDTH, ftxui::GREATER_THAN, 60) | ftxui::border;
        return window(ftxui::text(L" Error "), content);
    });
}

void ErrorModal::dismissErrorMessage(AppState* appState) {
    appState->errorMessage.clear();
    appState->screenDisplaying = dashboardComponent;
}