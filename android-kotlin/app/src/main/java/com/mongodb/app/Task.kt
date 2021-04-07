package com.mongodb.app

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import org.bson.types.ObjectId

open class Task(
        @PrimaryKey var _id: ObjectId = ObjectId(),
        var _partition: String = "",
        var isComplete: Boolean = false,
        var summary: String = ""
): RealmObject() {}
