#include "error-modal.hpp"

ftxui::Component ErrorModal::init(std::string* errorMessage, int* displayScreen) {
    okButton = ftxui::Button("Dismiss", [errorMessage, displayScreen]{ dismissErrorMessage(errorMessage, displayScreen); });

    buttonLayout = ftxui::Container::Horizontal({ okButton });

    return Renderer(buttonLayout, [=] {
        return ftxui::vbox({
                                   ftxui::hbox(ftxui::text(*errorMessage) | ftxui::hcenter),
                                   okButton->Render()
                           }) |
               ftxui::xflex | size(ftxui::WIDTH, ftxui::GREATER_THAN, 60) | ftxui::border;
    });
}

void ErrorModal::dismissErrorMessage(std::string* errorMessage, int* displayScreen) {
    errorMessage->clear();
    *displayScreen = dashboardComponent;
}