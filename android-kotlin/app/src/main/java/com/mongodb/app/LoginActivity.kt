package com.mongodb.app

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import io.realm.mongodb.Credentials

/*
* Launched whenever a user isn't already logged in. Allows a user to enter email
* and password credentials to log in to an existing account or create a new account.
*/
class LoginActivity : AppCompatActivity() {
    private lateinit var username: EditText
    private lateinit var password: EditText
    private lateinit var loginButton: Button
    private lateinit var accountExistsToggleButton: Button
    private var isCreateUserMode = true

    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        username = findViewById(R.id.input_username)
        password = findViewById(R.id.input_password)

        loginButton = findViewById(R.id.button_create_login)
        loginButton.setOnClickListener { onLoginButtonClicked() }

        accountExistsToggleButton = findViewById(R.id.button_existing_account)
        accountExistsToggleButton.setOnClickListener { toggleCreateUserMode() }
    }

    /**
     *  Handle account creation and user authentication
     */
    private fun onLoginButtonClicked() {
        val username = this.username.text.toString()
        val password = this.password.text.toString()
        if (isCreateUserMode) {
            registerUser(username, password)
        } else {
            logIn(username, password)
        }
    }

    /**
     *  Create a new user
     */
    private fun registerUser(username: String, password: String) {
        // while this operation completes, disable the button to login or create a new account
        loginButton.isEnabled = false
        // register a user using the Realm App
        realmApp.emailPassword.registerUserAsync(username, password) {
            // re-enable the button after user registration returns a result
            loginButton.isEnabled = true
            if (it.isSuccess) {
                // when the account has been created successfully, log in to the account
                Log.i(TAG(), "Successfully registered user.")
                logIn(username, password)
            } else {
                displayErrorMessage( "Error: ${it.error}")
            }
        }
    }

    /**
     *  Authenticate a user
     */
    private fun logIn(username: String, password: String) {
        // while this operation completes, disable the button to login or create a new account
        loginButton.isEnabled = false
        val creds = Credentials.emailPassword(username, password)
        realmApp.loginAsync(creds) {
            // re-enable the buttons after user login returns a result
            loginButton.isEnabled = true
            if (it.isSuccess) {
                // on a successful login, open the s screen
                startActivity(Intent(this, TaskActivity::class.java))
            } else {
                displayErrorMessage( "Error: ${it.error}")
            }
        }
    }

    /**
     *  Swap between create user mode and log in mode
     */
    private fun toggleCreateUserMode() {
        this.isCreateUserMode = !isCreateUserMode
        if (isCreateUserMode) {
            loginButton.setText(getString(R.string.create_account))
            accountExistsToggleButton.setText(getString(R.string.already_have_account))
        } else {
            loginButton.setText(getString(R.string.log_in))
            accountExistsToggleButton.setText(getString(R.string.does_not_have_account))
        }
    }

    /**
     *  Log an error and present it to the user
     */
    private fun displayErrorMessage(errorMsg: String) {
        Log.e(TAG(), errorMsg)
        Toast.makeText(baseContext, errorMsg, Toast.LENGTH_LONG).show()
    }
}
