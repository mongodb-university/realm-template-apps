package com.mongodb.app

import io.realm.kotlin.types.ObjectId
import io.realm.kotlin.types.RealmObject
import io.realm.kotlin.types.annotations.PrimaryKey

open class Item() : RealmObject {
        @PrimaryKey
        var _id: ObjectId = ObjectId.create()
        var isComplete: Boolean = false
        var summary: String = ""
        var owner_id: String = ""
        constructor(ownerId: String = "") : this() {
                owner_id = ownerId
        }
}
