import SwiftUI
import RealmSwift

/// Called when login completes. Opens the realm asynchronously and navigates to the Items screen.
struct OpenRealmView: View {
    @AsyncOpen(appId: theAppConfig.appId, timeout: 2000) var asyncOpen
    // We must pass the user, so we can set the user.id when we create Item objects
    @State var user: User
    @State var showMyItems = true
    @State var syncEnabled = true
    // Configuration used to open the realm.
    @Environment(\.realmConfiguration) private var config

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
            ItemsView(leadingBarButton: AnyView(LogoutButton()), user: user, showMyItems: $showMyItems, syncEnabled: $syncEnabled)
                // showMyItems toggles the creation of a subscription
                // When it's toggled on, only the original subscription is shown.
                // When it's toggled off, *all* items are downloaded to the
                // client, including from other users.
                .onChange(of: showMyItems) { newValue in
                    let subs = realm.subscriptions
                    subs.update {
                        if newValue {
                            subs.remove(named: "all_items")
                        } else {
                            if subs.first(named: "all_items") == nil {
                                subs.append(QuerySubscription<Item>(name: "all_items"))
                            }
                        }
                    }
                // syncEnabled simulates a situation with no internet connection.
                // While sync is not available, items can still be written and queried.
                // When sync is resumed, items created or updated will sync to other the
                // server, then other devices.
                }.onChange(of: syncEnabled) { newValue in
                    let syncSession = realm.syncSession!
                    newValue ? syncSession.resume() : syncSession.suspend()
                }.onAppear {
                    if let _ = realm.subscriptions.first(named: "all_items") {
                        // Subscribed to all items from a previous session, set toggle accordingly
                        showMyItems = false
                    }
                }
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
