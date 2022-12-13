package com.mongodb.app

import android.app.Application
import android.util.Log
import io.realm.BuildConfig

import io.realm.Realm
import io.realm.log.LogLevel
import io.realm.log.RealmLog
import io.realm.mongodb.App
import io.realm.mongodb.AppConfiguration

lateinit var realmApp: App

// global Kotlin extension that resolves to the short version
// of the name of the current class. Used for labelling logs.
inline fun <reified T> T.TAG(): String = T::class.java.simpleName

/*
*  Sets up the Realm App and enables Realm-specific logging in debug mode.
*/
class App: Application() {

    override fun onCreate() {
        super.onCreate()
        Realm.init(this)
        realmApp = App(
            AppConfiguration.Builder(getString(R.string.realm_app_id))
                .baseUrl(getString(R.string.realm_base_url))
                .build())

        // Enable more logging in debug mode
        if (BuildConfig.DEBUG) {
            RealmLog.setLevel(LogLevel.DEBUG)
        }

        Log.v(TAG(), "Initialized the Realm App configuration for: ${realmApp.configuration.appId}")
    }
}
