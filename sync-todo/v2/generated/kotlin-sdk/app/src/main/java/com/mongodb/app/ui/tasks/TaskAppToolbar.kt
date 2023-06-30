package com.mongodb.app.ui.tasks

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.mongodb.app.R
import com.mongodb.app.data.MockRepository
import com.mongodb.app.presentation.tasks.ToolbarEvent
import com.mongodb.app.presentation.tasks.ToolbarViewModel
import com.mongodb.app.app
import com.mongodb.app.ui.theme.MyApplicationTheme
import com.mongodb.app.ui.theme.Purple200
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@ExperimentalMaterial3Api
@Composable
fun TaskAppToolbar(viewModel: ToolbarViewModel) {
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
                    when (viewModel.offlineMode.value) {
                        true -> viewModel.goOnline()
                        false -> viewModel.goOffline()
                    }
                },
                colors = IconButtonDefaults.iconButtonColors(contentColor = Color.White)
            ) {
                Icon(
                    painter = painterResource(
                        id = when (viewModel.offlineMode.value) {
                            true -> R.drawable.ic_baseline_wifi_off_24_white
                            false -> R.drawable.ic_baseline_wifi_24_white
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
                            app.currentUser?.logOut()
                        }.onSuccess {
                            viewModel.logOut()
                        }.onFailure {
                            viewModel.error(ToolbarEvent.Error("Log out failed", it))
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
        val repository = MockRepository()
        val viewModel = ToolbarViewModel(repository)
        MyApplicationTheme {
            TaskAppToolbar(viewModel)
        }
    }
}
