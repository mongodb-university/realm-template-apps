import SwiftUI
import RealmSwift

/// Loads the app ID and baseUrl from the Realm.plist file.
func readRealmPlist() -> [String] {
    guard let path = Bundle.main.path(forResource: "Realm", ofType: "plist") else {
        fatalError("Could not load Realm.plist file!")
    }
    // Any errors here indicate that the Realm.plist file has not been formatted properly.
    // Expected key/values:
    //      "appId": "your Realm app ID"
    let data = NSData(contentsOfFile: path)! as Data
    let realmPropertyList = try! PropertyListSerialization.propertyList(from: data, format: nil) as! [String: Any]
    let appId = realmPropertyList["appId"]! as! String
    let baseUrl = realmPropertyList["baseUrl"]! as! String
    return [appId, baseUrl]
}

let realmPlistInfo: [String] = readRealmPlist()

let appId: String = realmPlistInfo[0]
let baseUrl: String = realmPlistInfo[1]
let realmApp = App(id: appId, configuration: AppConfiguration(baseURL: baseUrl, transport: nil, localAppName: nil, localAppVersion: nil))

@main
struct realmSwiftUIApp: SwiftUI.App {
    var body: some Scene {
        WindowGroup {
            ContentView(app: realmApp)
        }
    }
}
