package com.mongodb.app

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import io.realm.Realm

class ItemsActivity : AppCompatActivity() {
    private lateinit var logoutButton: Button
    private var user: io.realm.mongodb.User? = null
    private var userRealm: Realm? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_items)
        user = myApp.currentUser()
        if (user == null) {
            startActivity(Intent(this, LoginActivity::class.java))
        }
        logoutButton = findViewById(R.id.button_log_out)
        logoutButton.isEnabled = true
        logoutButton.setOnClickListener{ (logout()) }
    }

    private fun logout() {
        user?.logOutAsync {
            if (it.isSuccess) {
                user = null
                Log.v(TAG(), "user logged out")
                startActivity(Intent(this, LoginActivity::class.java))
            } else {
                Log.e(TAG(), "log out failed! Error: ${it.error}")
            }
        }
    }
}