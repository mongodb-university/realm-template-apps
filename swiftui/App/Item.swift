import RealmSwift

class Item: Object, ObjectKeyIdentifiable {
    @Persisted(primaryKey: true) var _id: ObjectId
    @Persisted var isComplete = false
    @Persisted var summary: String
    // :state-start: flexible-sync
    @Persisted var owner_id: String
    // :state-end:
}
