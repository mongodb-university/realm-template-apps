//let realmAppId = Bundle.main.object(forInfoDictionaryKey: "REALM_APP_ID") as? String

import SwiftUI
import RealmSwift

let realmAppId = "swiftui-template-oital"
let realmApp = App(id: realmAppId)

@main
struct realm_template_apps_swiftuiApp: SwiftUI.App {
    var body: some Scene {
        WindowGroup {
            ContentView(app: realmApp)
        }
    }
}
