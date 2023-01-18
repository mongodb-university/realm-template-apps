package com.mongodb.app

import android.app.Application
import android.util.Log
import io.realm.kotlin.mongodb.App

lateinit var realmApp: App

// global Kotlin extension that resolves to the short version
// of the name of the current class. Used for labelling logs.
inline fun <reified T> T.TAG(): String = T::class.java.simpleName

/*
*  Sets up the Realm App and enables Realm-specific logging in debug mode.
*/
class TemplateApp: Application() {

    override fun onCreate() {
        super.onCreate()
        realmApp = App.create(
            AppConfiguration.Builder(getString(R.string.realm_app_id))
                .baseUrl(getString(R.string.realm_base_url))
                .build()
        )

        Log.v(TAG(), "Initialized the Realm App configuration for: ${realmApp.configuration.appId}")
    }
}
