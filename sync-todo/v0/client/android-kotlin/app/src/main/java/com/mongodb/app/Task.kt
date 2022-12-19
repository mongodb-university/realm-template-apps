package com.mongodb.app

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import io.realm.annotations.RealmField
import org.bson.types.ObjectId

open class Task(
        @RealmField("_id") @PrimaryKey var id: ObjectId = ObjectId(),
        var isComplete: Boolean = false,
        var summary: String = ""
): RealmObject() {}
