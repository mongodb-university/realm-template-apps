@file:OptIn(ExperimentalMaterial3Api::class)

package com.mongodb.app

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FabPosition
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.toMutableStateList
import androidx.compose.ui.Alignment.Companion.CenterVertically
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.lifecycleScope
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.RealmSyncRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.presentation.additem.AddItemEvent
import com.mongodb.app.presentation.additem.AddItemViewModel
import com.mongodb.app.presentation.subscriptiontype.SubscriptionTypeEvent
import com.mongodb.app.presentation.subscriptiontype.SubscriptionTypeViewModel
import com.mongodb.app.presentation.tasks.TaskViewModel
import com.mongodb.app.presentation.toolbar.ToolbarEvent
import com.mongodb.app.presentation.toolbar.ToolbarViewModel
import com.mongodb.app.ui.tasks.AddItemPrompt
import com.mongodb.app.ui.tasks.ShowMyOwnTasks
import com.mongodb.app.ui.tasks.TaskAppToolbar
import com.mongodb.app.ui.tasks.TaskList
import com.mongodb.app.ui.theme.MyApplicationTheme
import com.mongodb.app.ui.theme.Purple200
import kotlinx.coroutines.launch

class ComposeItemActivity : ComponentActivity() {

    private val repository = RealmSyncRepository { _, error ->
        // Sync errors come from a background thread so route the Toast through the UI thread
        lifecycleScope.launch {
            // Catch write permission errors and notify user. This is just a 2nd line of defense
            // since we prevent users from modifying someone else's tasks
            // TODO the SDK does not have an enum for this type of error yet so make sure to update this once it has been added
            if (error.message?.contains("CompensatingWrite") == true) {
                Toast.makeText(this@ComposeItemActivity, getString(R.string.permissions_error), Toast.LENGTH_SHORT)
                    .show()
            }
        }
    }

    private val toolbarViewModel: ToolbarViewModel by viewModels {
        ToolbarViewModel.factory(repository, this)
    }
    private val addItemViewModel: AddItemViewModel by viewModels {
        AddItemViewModel.factory(repository, this)
    }
    private val subscriptionTypeViewModel: SubscriptionTypeViewModel by viewModels {
        SubscriptionTypeViewModel.factory(repository, this)
    }
    private val taskViewModel: TaskViewModel by viewModels {
        TaskViewModel.factory(repository, this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycleScope.launch {
            toolbarViewModel.toolbarEvent
                .collect { toolbarEvent ->
                    when (toolbarEvent) {
                        ToolbarEvent.LogOut -> {
                            startActivity(Intent(this@ComposeItemActivity, ComposeLoginActivity::class.java))
                            finish()
                        }
                        is ToolbarEvent.Info ->
                            Log.e(TAG(), toolbarEvent.message)
                        is ToolbarEvent.Error ->
                            Log.e(TAG(), "${toolbarEvent.message}: ${toolbarEvent.throwable.message}")
                    }
                }
            addItemViewModel.addItemEvent
                .collect { fabEvent ->
                    when (fabEvent) {
                        is AddItemEvent.Error ->
                            Log.e(TAG(), "${fabEvent.message}: ${fabEvent.throwable.message}")
                        is AddItemEvent.Info ->
                            Log.e(TAG(), fabEvent.message)
                    }
                }
            subscriptionTypeViewModel.subscriptionTypeEvent
                .collect { subscriptionTypeEvent ->
                    when (subscriptionTypeEvent) {
                        is SubscriptionTypeEvent.Error ->
                            Log.e(TAG(), "${subscriptionTypeEvent.message}: ${subscriptionTypeEvent.throwable.message}")
                        is SubscriptionTypeEvent.Info ->
                            Log.i(TAG(), subscriptionTypeEvent.message)
                    }
                }
        }

        setContent {
            MyApplicationTheme {
                TaskListScaffold(
                    repository,
                    toolbarViewModel,
                    addItemViewModel,
                    subscriptionTypeViewModel,
                    taskViewModel
                )
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        repository.close()
    }
}

@Composable
@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
fun TaskListScaffold(
    repository: SyncRepository,
    toolbarViewModel: ToolbarViewModel,
    addItemViewModel: AddItemViewModel,
    subscriptionTypeViewModel: SubscriptionTypeViewModel,
    taskViewModel: TaskViewModel
) {
    Scaffold(
        topBar = { TaskAppToolbar(toolbarViewModel) },
        bottomBar = {
            BottomAppBar(
                containerColor = Color.LightGray
            ) {
                Text(
                    text = stringResource(R.string.sync_message),
                    modifier = Modifier
                        .padding(16.dp)
                        .align(CenterVertically),
                    textAlign = TextAlign.Center,
                    color = Color.Black
                )
            }
        },
        floatingActionButtonPosition = FabPosition.End,
        floatingActionButton = {
            FloatingActionButton(
                shape = MaterialTheme.shapes.small.copy(CornerSize(percent = 50)),
                contentColor = Color.White,
                containerColor = Purple200,
                onClick = {
                    addItemViewModel.openAddTaskDialog()
                }
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Add Task"
                )
            }

            if (addItemViewModel.addItemPopupVisible.value) {
                AddItemPrompt(addItemViewModel)
            }
        },
        content = {
            Column {
                Spacer(modifier = Modifier.height(61.dp))
                Divider(color = Color.Red, modifier = Modifier.fillMaxWidth())
                ShowMyOwnTasks(subscriptionTypeViewModel)
                TaskList(repository, taskViewModel)
            }
        }
    )
}

@Preview(showBackground = true)
@Composable
fun ItemActivityPreview() {
    MyApplicationTheme {
        val repository = MockRepository()
        val tasks = (1..30).map { index ->
            MockRepository.getMockTask(index)
        }.toMutableStateList()

        MyApplicationTheme {
            TaskListScaffold(
                repository,
                ToolbarViewModel(repository),
                AddItemViewModel(repository),
                SubscriptionTypeViewModel(repository),
                TaskViewModel(repository, tasks)
            )
        }
    }
}
