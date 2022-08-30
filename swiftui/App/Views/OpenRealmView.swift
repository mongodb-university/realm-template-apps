import SwiftUI
import RealmSwift

/// Called when login completes. Opens the realm asynchronously and navigates to the Items screen.
struct OpenRealmView: View {
    // :state-start: partition-based-sync
    // By leaving the `partitionValue` an empty string, we use the
    // `.environment(\.partitionValue, user.id)` passed in from the `ContentView`
    @AsyncOpen(appId: theAppConfig.appId, partitionValue: "", timeout: 4000) var asyncOpen
    // :state-end:
    // :state-start: flexible-sync
    @AsyncOpen(appId: theAppConfig.appId, timeout: 2000) var asyncOpen
    // We must pass the user, so we can set the user.id when we create Item objects
    @State var user: User
    // :state-end:
       
    var body: some View {
        switch asyncOpen {
        // Starting the Realm.asyncOpen process.
        // Show a progress view.
        case .connecting:
            ProgressView()
        // Waiting for a user to be logged in before executing
        // Realm.asyncOpen.
        case .waitingForUser:
            ProgressView("Waiting for user to log in...")
        // The realm has been opened and is ready for use.
        // Show the Items view.
        case .open(let realm):
            // :state-start: partition-based-sync
            ItemsView(leadingBarButton: AnyView(LogoutButton()))
                .environment(\.realm, realm)
            // :state-end:
            // :state-start: flexible-sync
            ItemsView(leadingBarButton: AnyView(LogoutButton()), user: user)
                .environment(\.realm, realm)
            // :state-end:
       // The realm is currently being downloaded from the server.
       // Show a progress view.
       case .progress(let progress):
           ProgressView(progress)
       // Opening the Realm failed.
       // Show an error view.
       case .error(let error):
           ErrorView(error: error)
       }
    }
}
