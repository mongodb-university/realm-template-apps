import SwiftUI
import RealmSwift

/// Called when login completes. Opens the realm asynchronously and navigates to the Todos screen.
struct OpenRealmView: View {
    // By leaving the `partitionValue` an empty string, we use the
    // `.environment(\.partitionValue, user.id)` passed in from the `ContentView`
    @AsyncOpen(appId: realmAppId, partitionValue: "", timeout: 4000) var asyncOpen
       
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
           TodosView(leadingBarButton: AnyView(LogoutButton()))
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
