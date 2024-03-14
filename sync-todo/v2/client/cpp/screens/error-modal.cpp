#include "error-modal.hpp"

ftxui::Component ErrorModal::init(AppState* appState) {
    okButton = ftxui::Button("Dismiss", [appState]{ dismissErrorMessage(appState); });

    buttonLayout = ftxui::Container::Horizontal({ okButton });

    return Renderer(buttonLayout, [=] {
        return ftxui::vbox({
                                   ftxui::hbox(ftxui::text(appState->errorMessage) | ftxui::hcenter),
                                   okButton->Render()
                           }) |
               ftxui::xflex | size(ftxui::WIDTH, ftxui::GREATER_THAN, 60) | ftxui::border;
    });
}

void ErrorModal::dismissErrorMessage(AppState* appState) {
    appState->errorMessage.clear();
    appState->screenDisplaying = dashboardComponent;
}