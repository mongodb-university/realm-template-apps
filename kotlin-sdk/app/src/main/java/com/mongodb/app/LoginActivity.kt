package com.mongodb.app

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import io.realm.kotlin.mongodb.Credentials
import io.realm.kotlin.mongodb.exceptions.ConnectionException
import io.realm.kotlin.mongodb.exceptions.InvalidCredentialsException
import io.realm.kotlin.mongodb.exceptions.UserAlreadyExistsException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

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
        CoroutineScope(Dispatchers.IO).launch {
            // register a user using the Realm App
            runCatching {
                realmApp.emailPasswordAuth.registerUser(username, password)
            }.onSuccess {
                withContext(Dispatchers.Main) {
                    // re-enable the button after user registration returns a result
                    loginButton.isEnabled = true
                    Log.v(TAG(), "user logged in")
                    logIn(username, password)
                }
            }.onFailure { ex: Throwable ->
                Log.v(TAG(), "User failed to register with: ${ex.message}")
                withContext(Dispatchers.Main) {
                    when (ex) {
                        is UserAlreadyExistsException -> {
                            displayErrorMessage("Failed to register. User already exists.")
                        }
                        else -> {
                            displayErrorMessage("Failed to register: ${ex.message}")
                        }
                    }
                    // re-enable the button after user registration returns a result
                    loginButton.isEnabled = true
                }
            }
        }
    }

    /**
     *  Authenticate a user
     */
    private fun logIn(username: String, password: String) {
        // while this operation completes, disable the button to login or create a new account
        loginButton.isEnabled = false

        CoroutineScope(Dispatchers.IO).launch {
            runCatching {
                val creds = Credentials.emailPassword(username, password)
                realmApp.login(creds)
            }.onSuccess {
                withContext(Dispatchers.Main) {
                    // re-enable the button after user login returns a result
                    loginButton.isEnabled = true
                    Log.v(TAG(), "user logged in")

                    // on a successful login, open the item view
                    startActivity(Intent(application, ItemActivity::class.java))
                }
            }.onFailure { ex: Throwable ->
                when (ex) {
                    is InvalidCredentialsException -> {
                        Log.v(TAG(), "User failed to log in with: ${ex.message}")
                        withContext(Dispatchers.Main) {
                            displayErrorMessage("Invalid username or password. Check your credentials and try again.")
                        }
                    }
                    is ConnectionException -> {
                        Log.v(TAG(), "User failed to log in with: ${ex.message}")
                        withContext(Dispatchers.Main) {
                            displayErrorMessage("Could not connect to the authentication provider. Check your internet connection and try again.")
                        }
                    }
                    else -> {
                        Log.e(TAG(), ex.toString())
                        withContext(Dispatchers.Main) {
                            displayErrorMessage("Error: $ex")
                        }
                    }
                }
                withContext(Dispatchers.Main) {
                    // re-enable the button after user login returns a result
                    loginButton.isEnabled = true
                }
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
