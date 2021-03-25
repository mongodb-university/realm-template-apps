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
* LoginActivity: launched whenever a user isn't already logged in. Allows a user to enter email
* and password credentials to log in to an existing account or create a new account.
*/
class LoginActivity : AppCompatActivity() {
    private lateinit var username: EditText
    private lateinit var password: EditText
    private lateinit var loginButton: Button
    private lateinit var accountExistsToggleButton: Button
    private var createUser = true

    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        username = findViewById(R.id.input_username)
        password = findViewById(R.id.input_password)
        loginButton = findViewById(R.id.button_create_login)
        accountExistsToggleButton = findViewById(R.id.button_existing_account)

        loginButton.setOnClickListener { login() }
        accountExistsToggleButton.setOnClickListener { toggleExistingUser() }

        loginButton.isEnabled = true
        accountExistsToggleButton.isEnabled = true
    }

    override fun onBackPressed() {
        // Disable going back to the MainActivity
        moveTaskToBack(true)
    }

    private fun onLoginSuccess() {
        // successful login ends this activity, bringing the user back to the project activity
        startActivity(Intent(this, ItemsActivity::class.java))
        // finish()
    }

    private fun onLoginFailed(errorMsg: String) {
        Log.e(TAG(), errorMsg)
        Toast.makeText(baseContext, errorMsg, Toast.LENGTH_LONG).show()
    }

    // Function to validate that the username adheres to all username rules.
    private fun validateUsername(username: String): Boolean {
        if (username.isEmpty()) {
            return false // An empty username is not valid.
        }
        return true
    }

    // Function to validate that the password adheres to all password rules.
    private fun validatePassword(password: String): Boolean {
        if (password.isEmpty()) {
            return false // An empty password is not valid.
        }
        return true
    }

    // Function to swap the log in use case with the create account use case.
    private fun toggleExistingUser() {
        this.createUser = !createUser
        if (createUser) {
            loginButton.setText(getString(R.string.create_account))
            accountExistsToggleButton.setText(getString(R.string.already_have_account))
        } else {
            loginButton.setText(getString(R.string.log_in))
            accountExistsToggleButton.setText(getString(R.string.does_not_have_account))
        }
    }

    // handle user authentication (login) and account creation
    private fun login() {
        // while this operation completes, disable the button to login or create a new account
        loginButton.isEnabled = false

        val username = this.username.text.toString()
        val password = this.password.text.toString()

        if (!validateUsername(username)) {
            onLoginFailed("Invalid username")
            return
        }
        if (!validatePassword(password)) {
            onLoginFailed("Invalid password")
            return
        }

        if (createUser) {
            // register a user using the Realm App
            myApp.emailPassword.registerUserAsync(username, password) {
                // re-enable the buttons after user registration returns a result
                loginButton.isEnabled = true
                if (!it.isSuccess) {
                    onLoginFailed( "Error: ${it.error}")
                } else {
                    Log.i(TAG(), "Successfully registered user.")
                    // when the account has been created successfully, log in to the account
                    this.createUser = false
                    login()
                }
            }
        } else {
            val creds = Credentials.emailPassword(username, password)
            myApp.loginAsync(creds) {
                // re-enable the buttons after user login returns a result
                loginButton.isEnabled = true
                if (!it.isSuccess) {
                    onLoginFailed( "Error: ${it.error}")
                } else {
                    onLoginSuccess()
                }
            }
        }
    }
}