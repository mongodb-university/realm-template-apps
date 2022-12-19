import SwiftUI
import RealmSwift

/// This method loads app config details from a Realm.plist we generate
/// for the template apps.
/// When you create your own Realm app, use your preferred method
/// to store and access app configuration details.
let theAppConfig = loadAppConfig()

let realmApp = App(id: theAppConfig.appId, configuration: AppConfiguration(baseURL: theAppConfig.baseUrl, transport: nil, localAppName: nil, localAppVersion: nil))

@main
struct realmSwiftUIApp: SwiftUI.App {
    @StateObject var errorHandler = ErrorHandler(app: realmApp)

    var body: some Scene {
        WindowGroup {
            ContentView(app: realmApp)
                .environmentObject(errorHandler)
                .alert(Text("Error"), isPresented: .constant(errorHandler.error != nil)) {
                    Button("OK", role: .cancel) { errorHandler.error = nil }
                } message: {
                    Text(errorHandler.error?.localizedDescription ?? "")
                }
        }
    }
}

final class ErrorHandler: ObservableObject {
    @Published var error: Swift.Error?

    init(app: RealmSwift.App) {
        // Sync Manager listens for sync errors.
        app.syncManager.errorHandler = { syncError, syncSession in
            self.error = syncError
        }
    }
}
