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
        if (myApp.currentUser() == null) {
            startActivity(Intent(this, LoginActivity::class.java))
        }
        logoutButton = findViewById(R.id.button_log_out)
        logoutButton.isEnabled = true
        logoutButton.setOnClickListener{ (logout()) }
    }

    private fun logout() {
        // while this operation completes, disable the button to logout
        logoutButton.isEnabled = false
        myApp.currentUser()?.logOutAsync {
            // re-enable the button after user registration returns a result
            logoutButton.isEnabled = true
            if (it.isSuccess) {
                myApp.removeUser(myApp.currentUser())
                Log.v(TAG(), "user logged out")
                startActivity(Intent(this, LoginActivity::class.java))
            } else {
                Log.e(TAG(), "log out failed! Error: ${it.error}")
            }
        }
    }
}
