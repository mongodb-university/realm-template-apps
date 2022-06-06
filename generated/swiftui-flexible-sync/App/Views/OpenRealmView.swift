import SwiftUI
import RealmSwift

/// Called when login completes. Opens the realm asynchronously and navigates to the Todos screen.
struct OpenRealmView: View {
    @AsyncOpen(appId: theAppConfig.appId, timeout: 2000) var asyncOpen
    // We must pass the user, so we can set the user.id when we create Todo objects
    @State var user: User
       
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
        // Show the Todos view.
        case .open(let realm):
            TodosView(leadingBarButton: AnyView(LogoutButton()), user: user)
                .environment(\.realm, realm)
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
