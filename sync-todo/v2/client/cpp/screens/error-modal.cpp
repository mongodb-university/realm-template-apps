#include "error-modal.hpp"

ftxui::Component ErrorModal::init(std::string* errorMessage, int* depth) {
    okButton = ftxui::Button("Dismiss", [errorMessage, depth]{ dismissErrorMessage(errorMessage, depth); });

    buttonLayout = ftxui::Container::Horizontal({ okButton });

    return Renderer(buttonLayout, [=] {
        return ftxui::vbox({
                                   ftxui::hbox(ftxui::text(*errorMessage) | ftxui::hcenter),
                                   okButton->Render()
                           }) |
               ftxui::xflex | size(ftxui::WIDTH, ftxui::GREATER_THAN, 60) | ftxui::border;
    });
}

void ErrorModal::dismissErrorMessage(std::string* errorMessage, int* depth) {
    errorMessage->clear();
    *depth = 0;
}