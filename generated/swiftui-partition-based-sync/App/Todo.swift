import RealmSwift

class Todo: Object, ObjectKeyIdentifiable {
    @Persisted(primaryKey: true) var _id: ObjectId
    @Persisted var isComplete = false
    @Persisted var summary: String
}
