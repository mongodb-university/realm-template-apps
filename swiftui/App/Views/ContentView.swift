import SwiftUI
import RealmSwift

struct ContentView: View {
    @ObservedObject var app: RealmSwift.App
    
    var body: some View {
        if let user = app.currentUser {
            // If there is a logged in user, pass the user ID as the
            // partitionValue to the view that opens a realm.
            OpenRealmView().environment(\.partitionValue, user.id)
        } else {
            // If there is no user logged in, show the login view.
            LoginView()
        }
        Text("Built with the MongoDB Realm Sync Template")
            .font(.footnote)
            .padding()
    }
}
