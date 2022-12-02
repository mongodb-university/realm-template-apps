package com.mongodb.app.ui.login

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mongodb.app.ComposeItemActivity
import com.mongodb.app.R
import com.mongodb.app.TAG
import com.mongodb.app.realmApp
import com.mongodb.app.ui.theme.Blue
import com.mongodb.app.ui.theme.Purple200
import io.realm.kotlin.mongodb.Credentials
import io.realm.kotlin.mongodb.exceptions.ConnectionException
import io.realm.kotlin.mongodb.exceptions.InvalidCredentialsException
import io.realm.kotlin.mongodb.exceptions.UserAlreadyExistsException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

private enum class UserAction {
    CREATE_ACCOUNT, LOGIN
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
fun LoginScaffold() {
    val context = LocalContext.current

    Scaffold(
        content = {
            Column {
                // Title
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .fillMaxHeight(0.25f)
                        .fillMaxWidth()
                ) {
                    Text(
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center,
                        text = stringResource(R.string.app_name),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                // Email and password
                Box(
                    contentAlignment = Alignment.TopCenter,
                    modifier = Modifier
                        .fillMaxHeight(0.75f)
                        .fillMaxWidth()
                ) {
                    Column {
                        val userAction = remember { mutableStateOf(UserAction.LOGIN) }
                        val email = remember { mutableStateOf("") }
                        val password = remember { mutableStateOf("") }
                        val actionButtonEnabled = remember { mutableStateOf(true) }

                        TextField(
                            modifier = Modifier.fillMaxWidth(com.mongodb.app.USABLE_WIDTH),
                            value = email.value,
                            maxLines = 2,
                            onValueChange = { email.value = it },
                            label = { Text(stringResource(R.string.prompt_email)) }
                        )
                        TextField(
                            visualTransformation = PasswordVisualTransformation(),
                            modifier = Modifier.fillMaxWidth(com.mongodb.app.USABLE_WIDTH),
                            value = password.value,
                            maxLines = 2,
                            onValueChange = { password.value = it },
                            label = { Text(stringResource(R.string.prompt_password)) }
                        )
                        Spacer(modifier = Modifier.height(40.dp))
                        Button(
                            enabled = actionButtonEnabled.value,
                            colors = ButtonDefaults.buttonColors(containerColor = Purple200),
                            modifier = Modifier.fillMaxWidth(com.mongodb.app.USABLE_WIDTH),
                            onClick = {
                                // Disable button until we get a response
                                actionButtonEnabled.value = !actionButtonEnabled.value

                                when (userAction.value) {
                                    UserAction.CREATE_ACCOUNT ->
                                        registerUser(
                                            context,
                                            email.value,
                                            password.value,
                                            actionButtonEnabled
                                        )
                                    UserAction.LOGIN -> {
                                        login(
                                            context,
                                            email.value,
                                            password.value,
                                            actionButtonEnabled
                                        )
                                    }
                                }
                            }
                        ) {
                            val actionText = when (userAction.value) {
                                UserAction.CREATE_ACCOUNT -> stringResource(R.string.create_account)
                                UserAction.LOGIN -> stringResource(R.string.log_in)
                            }
                            Text(actionText)
                        }
                        Spacer(modifier = Modifier.height(40.dp))
                        TextButton(
                            onClick = {
                                when (userAction.value) {
                                    UserAction.CREATE_ACCOUNT -> userAction.value = UserAction.LOGIN
                                    UserAction.LOGIN -> userAction.value = UserAction.CREATE_ACCOUNT
                                }
                            }
                        ) {
                            val actionText = when (userAction.value) {
                                UserAction.CREATE_ACCOUNT -> stringResource(R.string.does_not_have_account)
                                UserAction.LOGIN -> stringResource(R.string.already_have_account)
                            }
                            Text(
                                text = actionText,
                                modifier = Modifier.fillMaxWidth(com.mongodb.app.USABLE_WIDTH),
                                textAlign = TextAlign.Center,
                                color = Blue
                            )
                        }
                    }
                }
            }
        }
    )
}

private fun registerUser(
    context: Context,
    email: String,
    password: String,
    actionButtonEnabled: MutableState<Boolean>
) {
    CoroutineScope(Dispatchers.IO).launch {
        // Register a user using the Realm App
        runCatching {
            realmApp.emailPasswordAuth.registerUser(email, password)
        }.onSuccess {
            Log.v(TAG(), "user logged in")
            login(context, email, password, actionButtonEnabled)
        }.onFailure { ex: Throwable ->
            Log.v(TAG(), "User failed to register with: ${ex.message}")
            when (ex) {
                is UserAlreadyExistsException -> {
                    displayErrorMessage(context, "Failed to register. User already exists.")
                }
                else -> {
                    displayErrorMessage(context, "Failed to register: ${ex.message}")
                }
            }

            // Re-enable button if something failed
            actionButtonEnabled.value = !actionButtonEnabled.value
        }
    }
}

private fun login(
    context: Context,
    email: String,
    password: String,
    actionButtonEnabled: MutableState<Boolean>
) {
    CoroutineScope(Dispatchers.IO).launch {
        runCatching {
            val creds = Credentials.emailPassword(email, password)
            realmApp.login(creds)
        }.onSuccess {
            withContext(Dispatchers.Main) {
                Log.v(TAG(), "user logged in")

                // on a successful login, open the item view
                context.startActivity(Intent(context, ComposeItemActivity::class.java))
                (context as Activity).finish()
            }
        }.onFailure { ex: Throwable ->
            when (ex) {
                is InvalidCredentialsException -> {
                    Log.v(TAG(), "User failed to log in with: ${ex.message}")
                    displayErrorMessage(
                        context,
                        "Invalid username or password. Check your credentials and try again."
                    )
                }
                is ConnectionException -> {
                    Log.v(TAG(), "User failed to log in with: ${ex.message}")
                    displayErrorMessage(
                        context,
                        "Could not connect to the authentication provider. Check your internet connection and try again."
                    )
                }
                else -> {
                    Log.e(TAG(), ex.toString())
                    displayErrorMessage(context, "Error: $ex")
                }
            }
            withContext(Dispatchers.Main) {
                // re-enable the button after user login returns a result
                actionButtonEnabled.value = !actionButtonEnabled.value
            }
        }
    }
}

private fun displayErrorMessage(context: Context, message: String) {
    CoroutineScope(Dispatchers.Main).launch {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show()
    }
}
