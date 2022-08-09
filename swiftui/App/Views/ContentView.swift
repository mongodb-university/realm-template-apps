import SwiftUI
import RealmSwift

struct ContentView: View {
    @ObservedObject var app: RealmSwift.App
    
    var body: some View {
        if let user = app.currentUser {
            // :state-start: partition-based-sync
            // If there is a logged in user, pass the user ID as the
            // partitionValue to the view that opens a realm.
            OpenRealmView().environment(\.partitionValue, user.id)
            // :state-end:
            // :state-start: flexible-sync
            let config = user.flexibleSyncConfiguration(initialSubscriptions: { subs in
                if let foundSubscription = subs.first(named: "user_tasks") {
                    // Existing subscription found - do nothing
                    return
                } else {
                    subs.append(QuerySubscription<Item>(name: "user_tasks") {
                        $0.owner_id == user.id
                    })
                }
            })
            OpenRealmView(user: user).environment(\.realmConfiguration, config)
            // :state-end:
        } else {
            // If there is no user logged in, show the login view.
            LoginView()
        }
        Text("Built with the Atlas Device Sync Template")
            .font(.footnote)
            .padding()
    }
}
