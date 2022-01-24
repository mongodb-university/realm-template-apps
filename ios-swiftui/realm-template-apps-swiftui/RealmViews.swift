import SwiftUI
import RealmSwift

/// Log in or register users using email/password authentication
struct LoginView: View {
    @State var email = ""
    @State var password = ""
    
    @State private var isInSignUpMode = false
    @State private var isRegistering = false
    @State private var isLoggingIn = false
    @State private var showError = false
    @State var error: ErrorInfo?
    
    var body: some View {
        Spacer()
        VStack {
            Text("My Sync App")
                .font(.title)
            TextField("Email", text: $email)
                .textInputAutocapitalization(.never)
                .textFieldStyle(.roundedBorder)
            SecureField("Password", text: $password)
                .textFieldStyle(.roundedBorder)
            Button("Log In") {
                isLoggingIn = true
                login(email: email, password: password)
            }
            .frame(width: 150, height: 50)
            .background(Color.gray)
            .foregroundColor(.white)
            .clipShape(Capsule())

            Button("Create Account") {
                isRegistering = true
                signUp(email: email, password: password)
            }
            .frame(width: 150, height: 50)
            .background(Color.gray)
            .foregroundColor(.white)
            .clipShape(Capsule())
        }
        /// If there is an error during login or registration, present the user with an error alert.
        .alert(
            isPresented: $showError,
            error: error, // 1
            actions: { error in // 2
                if let suggestion = error.recoverySuggestion {
                    Button(suggestion, action: {
                        // Recover from an error
                    })
                }
            }, message: { error in // 3
            if let failureReason = error.failureReason {
                Text(failureReason)
            } else {
                Text("Something went wrong")
            }
        })
        .padding()
        Spacer()
    }
    
    /// Logs in with an existing user.
    func login(email: String, password: String) {
        realmApp.login(credentials: Credentials.emailPassword(email: email, password: password)) { result in
            isLoggingIn = false
            if case let .failure(errorReason) = result {
                print("Failed to log in: \(errorReason.localizedDescription)")
                showError = true
                error = ErrorInfo(
                    errorDescription: "Failed to log in", failureReason: errorReason.localizedDescription, recoverySuggestion: "Try again"
                )
                return
            }
            print("Logged in")
        }
    }
    
    /// Registers a new user with the email/password authentication provider.
    func signUp(email: String, password: String) {
        realmApp.emailPasswordAuth.registerUser(email: email, password: password) { (errorReason) in
            guard errorReason == nil else {
                isRegistering = false
                print("Failed to register user: \(errorReason?.localizedDescription)")
                showError = true
                error = ErrorInfo(
                    errorDescription: "Failed to register user", failureReason: errorReason?.localizedDescription, recoverySuggestion: "Try again"
                )
                return
            }
            isRegistering = false
            isLoggingIn = true
            login(email: email, password: password)
        }
    }
}

/// Logout from the synchronized realm. Returns the user to the login/sign up screen.
struct LogoutView: View {
    @State var isLoggedOut: Bool
    @Binding var isLoggingOut: Bool
    @State private var showError = false
    @State var error: ErrorInfo?
    
    var body: some View {
        if isLoggedOut {
            LoginView()
        } else {
            VStack {
                Text("Log Out")
                    .font(.title)
                Button("Yes, Log Out") {
                    logout()
                    isLoggedOut = true
                }
                .frame(width: 150, height: 50)
                .background(Color.gray)
                .foregroundColor(.white)
                .clipShape(Capsule())
                Button("Cancel") {
                    isLoggingOut = false
                }
                .frame(width: 150, height: 50)
                .background(Color.gray)
                .foregroundColor(.white)
                .clipShape(Capsule())
            }
            .alert(
                isPresented: $showError,
                error: error, // 1
                actions: { error in // 2
                    if let suggestion = error.recoverySuggestion {
                        Button(suggestion, action: {
                            // Recover from an error
                        })
                    }
                }, message: { error in // 3
                if let failureReason = error.failureReason {
                    Text(failureReason)
                } else {
                    Text("Something went wrong")
                }
            })
        }
    }
    
    func logout() {
        realmApp.currentUser?.logOut() { (errorReason) in
            guard errorReason == nil else {
                isLoggingOut = false
                print("Failed to logout: \(errorReason?.localizedDescription)")
                showError = true
                error = ErrorInfo(
                    errorDescription: "Failed to logout", failureReason: errorReason?.localizedDescription, recoverySuggestion: "Try again"
                )
                return
            }
            isLoggedOut = true
        }
    }
}

/// Called when login completes. Opens the realm asynchronously and navigates to the Tasks screen.
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
       // Show the Tasks view.
       case .open(let realm):
           TasksView()
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

/// Capture error and recovery information for optional authentication error alerts
struct ErrorInfo: LocalizedError {
    var errorDescription: String?
    var failureReason: String?
    var recoverySuggestion: String?
    var helpAnchor: String?
}
