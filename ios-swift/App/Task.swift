import Foundation
import RealmSwift

class Task: Object {
    @objc dynamic var _id: ObjectId = ObjectId.generate()
    @objc dynamic var isComplete: Bool = false
    @objc dynamic var summary: String = ""
    override static func primaryKey() -> String? {
        return "_id"
    }
    
    convenience init(summary: String) {
        self.init()
        self.summary = summary
    }
}
