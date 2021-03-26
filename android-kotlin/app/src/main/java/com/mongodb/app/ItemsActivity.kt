package com.mongodb.app

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import io.realm.Realm

class ItemsActivity : AppCompatActivity() {
    private lateinit var logoutButton: Button
    private var userRealm: Realm? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_items)
        if (realmApp.currentUser() == null) {
            startActivity(Intent(this, LoginActivity::class.java))
        }
        logoutButton = findViewById(R.id.button_log_out)
        logoutButton.isEnabled = true
        logoutButton.setOnClickListener{ (logOut()) }
    }

    private fun logOut() {
        // while this operation completes, disable the button to logout
        logoutButton.isEnabled = false
        realmApp.currentUser()?.logOutAsync {
            // re-enable the button after user registration returns a result
            logoutButton.isEnabled = true
            if (it.isSuccess) {
                realmApp.removeUser(realmApp.currentUser())
                Log.v(TAG(), "user logged out")
                startActivity(Intent(this, LoginActivity::class.java))
            } else {
                Log.e(TAG(), "log out failed! Error: ${it.error}")
            }
        }
    }
}
