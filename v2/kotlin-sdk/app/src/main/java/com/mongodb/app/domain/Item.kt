package com.mongodb.app.domain

import io.realm.kotlin.types.RealmObject
import io.realm.kotlin.types.annotations.PrimaryKey
import org.mongodb.kbson.ObjectId

class Item() : RealmObject {
    @PrimaryKey
    var _id: ObjectId = ObjectId()
    var isComplete: Boolean = false
    var summary: String = ""
    var owner_id: String = ""

    constructor(ownerId: String = "") : this() {
        owner_id = ownerId
    }

    override fun equals(other: Any?): Boolean {
        if (other == null) return false
        if (other !is Item) return false
        if (this._id != other._id) return false
        if (this.isComplete != other.isComplete) return false
        if (this.summary != other.summary) return false
        if (this.owner_id != other.owner_id) return false
        return true
    }

    override fun hashCode(): Int {
        var result = _id.hashCode()
        result = 31 * result + isComplete.hashCode()
        result = 31 * result + summary.hashCode()
        result = 31 * result + owner_id.hashCode()
        return result
    }
}
