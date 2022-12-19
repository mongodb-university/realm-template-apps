import Foundation
import RealmSwift

class Task: Object {
    @Persisted(primaryKey: true) var _id: ObjectId
    @Persisted var isComplete = false
    @Persisted var summary = ""

    convenience init(summary: String) {
        self.init()
        self.summary = summary
    }
}
