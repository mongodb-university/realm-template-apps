import SwiftUI
import RealmSwift

/// Logout from the synchronized realm. Returns the user to the login/sign up screen.
struct LogoutButton: View {
    @State var isLoggingOut = false
    @State var error: Error?
    
    var body: some View {
        if isLoggingOut {
            ProgressView()
        }
        if let error = error {
            Text("Error: \(error.localizedDescription)")
        }
        Button("Log Out") {
            guard let user = realmApp.currentUser else {
                return
            }
            isLoggingOut = true
            Task.init {
                await logout(user: user)
                isLoggingOut = false
                // Other views are observing the app and will detect
                // that the currentUser has changed. Nothing more to do here.
            }
        }.disabled(realmApp.currentUser == nil || isLoggingOut)
    }
    
    func logout(user: User) async {
        do {
            try await user.logOut()
            print("Successfully logged user out")
        } catch {
            print("Failed to log user out: \(error.localizedDescription)")
            self.error = error
        }
    }
}
