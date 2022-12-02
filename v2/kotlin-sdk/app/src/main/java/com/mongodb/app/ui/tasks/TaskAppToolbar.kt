package com.mongodb.app.ui.tasks

import android.app.Activity
import android.content.Intent
import android.util.Log
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.mongodb.app.ComposeLoginActivity
import com.mongodb.app.R
import com.mongodb.app.TAG
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.realmApp
import com.mongodb.app.ui.theme.MyApplicationTheme
import com.mongodb.app.ui.theme.Purple200
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@ExperimentalMaterial3Api
@Composable
fun TaskAppToolbar(repository: SyncRepository) {
    val context = LocalContext.current
    val offlineMode: MutableState<Boolean> = remember { mutableStateOf(false) }

    TopAppBar(
        title = {
            Text(
                text = stringResource(R.string.app_name),
                color = Color.White
            )
        },
        colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = Purple200),
        actions = {
            // Offline mode
            IconButton(
                onClick = {
                    when (offlineMode.value) {
                        true -> repository.resumeSync()
                        false -> repository.pauseSync()
                    }
                    offlineMode.value = !offlineMode.value
                },
                colors = IconButtonDefaults.iconButtonColors(contentColor = Color.White)
            ) {
                Icon(
                    painter = painterResource(
                        id = when {
                            offlineMode.value -> R.drawable.ic_baseline_wifi_off_24_white
                            else -> R.drawable.ic_baseline_wifi_24_white
                        }
                    ),
                    contentDescription = null
                )
            }

            // Log out
            IconButton(
                onClick = {
                    CoroutineScope(Dispatchers.IO).launch {
                        runCatching {
                            realmApp.currentUser?.logOut()
                        }.onSuccess {
                            Log.v(TAG(), "user logged out")
                            withContext(Dispatchers.Main) {
//                                context.startActivity(Intent(context, LoginActivity::class.java))
                                context.startActivity(Intent(context, ComposeLoginActivity::class.java))
                                (context as Activity).finish()
                            }
                        }.onFailure { ex: Throwable ->
                            Log.e(TAG(), "log out failed! Error: ${ex.message}")
                        }
                    }
                },
                colors = IconButtonDefaults.iconButtonColors(contentColor = Color.White)
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_baseline_logout_24_white),
                    contentDescription = null
                )
            }
        })
}

@OptIn(ExperimentalMaterial3Api::class)
@Preview(showBackground = true)
@Composable
fun TaskAppToolbarPreview() {
    MyApplicationTheme {
        val repository = MockRepository(remember { mutableStateListOf() })
        MyApplicationTheme {
            TaskAppToolbar(repository)
        }
    }
}
