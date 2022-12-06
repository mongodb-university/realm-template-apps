import SwiftUI
import RealmSwift

struct ContentView: View {
    @ObservedObject var app: RealmSwift.App
    @EnvironmentObject var errorHandler: ErrorHandler

    var body: some View {
        if let user = app.currentUser {
            let config = user.flexibleSyncConfiguration(initialSubscriptions: { subs in
                subs.remove(named: "all_items")
                if let _ = subs.first(named: "user_tasks") {
                    // Existing subscription found - do nothing
                    return
                } else {
                    subs.append(QuerySubscription<Item>(name: "user_tasks") {
                        $0.owner_id == user.id
                    })
                }
            })
            OpenRealmView(user: user)
                .environment(\.realmConfiguration, config)
        } else {
            // If there is no user logged in, show the login view.
            LoginView()
        }
    }
}
