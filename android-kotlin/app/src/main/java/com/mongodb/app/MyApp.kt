package com.mongodb.app

import android.app.Application
import android.util.Log

import io.realm.Realm
import io.realm.log.LogLevel
import io.realm.log.RealmLog
import io.realm.mongodb.App
import io.realm.mongodb.AppConfiguration

lateinit var myApp: App

// global Kotlin extension that resolves to the short version
// of the name of the current class. Used for labelling logs.
inline fun <reified T> T.TAG(): String = T::class.java.simpleName
const val PARTITION_EXTRA_KEY = "PARTITION"
const val PROJECT_NAME_EXTRA_KEY = "PROJECT NAME"

/*
* TemplateApp: Sets up the template Realm App and enables Realm-specific logging in debug mode.
*/
class TemplateApp: Application() {

    override fun onCreate() {
        super.onCreate()
        Realm.init(this)
         myApp = App(
            AppConfiguration.Builder(getString(R.string.app_id))
                .build())

        // Enable more logging in debug mode
        if (BuildConfig.DEBUG) {
            RealmLog.setLevel(LogLevel.ALL)
        }

        Log.v(TAG(), "Initialized the Realm App configuration for: ${ myApp.configuration.appId}")
    }
}