import SwiftUI
import RealmSwift

/// Logout from the synchronized realm. Returns the user to the login/sign up screen.
struct LogoutButton: View {
    @State var isLoggingOut = false
    
    var body: some View {
        Button("Log Out") {
            guard let user = realmApp.currentUser else {
                return
            }
            isLoggingOut = true
            user.logOut() { error in
                isLoggingOut = false
                // Other views are observing the app and will detect
                // that the currentUser has changed. Nothing more to do here.
                print("Logged out")
            }
        }.disabled(realmApp.currentUser == nil || isLoggingOut)
    }
}
