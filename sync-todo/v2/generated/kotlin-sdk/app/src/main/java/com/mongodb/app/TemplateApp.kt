package com.mongodb.app

import android.app.Application
import android.util.Log
import io.realm.kotlin.mongodb.App
import io.realm.kotlin.mongodb.AppConfiguration

lateinit var app: App

// global Kotlin extension that resolves to the short version
// of the name of the current class. Used for labelling logs.
inline fun <reified T> T.TAG(): String = T::class.java.simpleName

/*
*  Sets up the App and enables Realm-specific logging in debug mode.
*/
class TemplateApp: Application() {

    override fun onCreate() {
        super.onCreate()
        app = App.create(
            AppConfiguration.Builder(getString(R.string.realm_app_id))
                .baseUrl(getString(R.string.realm_base_url))
                .build()
        )
        Log.v(TAG(), "Initialized the App configuration for: ${app.configuration.appId}")
        // If you're getting this app code by cloning the repository at
        // https://github.com/mongodb/template-app-kotlin-todo, 
        // it does not contain the data explorer link. Download the
        // app template from the Atlas UI to view a link to your data.
        Log.v(TAG(),"To see your data in Atlas, follow this link:" + getString(R.string.dataExplorerLink))
    }
}
