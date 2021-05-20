import RealmSwift
import UIKit

/// The global instance of the Realm app. Loads the app ID from the Realm.plist file.
var realmApp: App = {
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
    return App(id: appId,
                  configuration: AppConfiguration(baseURL: baseUrl, transport: nil, localAppName: nil, localAppVersion: nil))
}()
