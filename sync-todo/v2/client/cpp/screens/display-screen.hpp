#pragma once

// DisplayScreen controls whether a modal is displayed over the main dashboard.
// By default, we display the dashboard. We may overlay that with an authModal or
// errorModal.
enum DisplayScreen: int {
    placeholderComponent,
    dashboardComponent,
    authModalComponent,
    errorModalComponent
};