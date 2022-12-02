@file:OptIn(ExperimentalMaterial3Api::class)

package com.mongodb.app

import android.annotation.SuppressLint
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
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
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment.Companion.CenterVertically
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.RealmRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.ui.tasks.AddItem
import com.mongodb.app.ui.tasks.ShowMyOwnTasks
import com.mongodb.app.ui.tasks.TaskAppToolbar
import com.mongodb.app.ui.tasks.TaskList
import com.mongodb.app.ui.theme.MyApplicationTheme
import com.mongodb.app.ui.theme.Purple200

class ComposeItemActivity : ComponentActivity() {

    private lateinit var repository: SyncRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            repository = RealmRepository(this, remember { mutableStateListOf() })
            MyApplicationTheme {
                TaskListScaffold(repository)
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
fun TaskListScaffold(repository: SyncRepository) {
    Scaffold(
        topBar = { TaskAppToolbar(repository) },
        bottomBar = {
            BottomAppBar(
                containerColor = Color.LightGray
            ) {
                Text(
                    modifier = Modifier
                        .padding(16.dp)
                        .align(CenterVertically),
                    text = stringResource(R.string.sync_message),
                    color = Color.Black
                )
            }
        },
        floatingActionButtonPosition = FabPosition.End,
        floatingActionButton = {
            val openDialog: MutableState<Boolean> = remember { mutableStateOf(false) }
            val taskSummary: MutableState<String> = remember { mutableStateOf("") }

            FloatingActionButton(
                shape = MaterialTheme.shapes.small.copy(CornerSize(percent = 50)),
                contentColor = Color.White,
                containerColor = Purple200,
                onClick = {
                    openDialog.value = !openDialog.value
                }
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Add Task"
                )
            }

            if (openDialog.value) {
                AddItem(repository, openDialog, taskSummary)
            }
        },
        content = {
            Column {
                Spacer(modifier = Modifier.height(61.dp))
                Divider(color = Color.Red, modifier = Modifier.fillMaxWidth())
                ShowMyOwnTasks(repository)
                TaskList(repository)
            }
        }
    )
}

@Preview(showBackground = true)
@Composable
fun ItemActivityPreview() {
    MyApplicationTheme {
        val tasks = (1..30).map { index ->
            MockRepository.getMockTask(index)
        }.toMutableList()
        val repository = MockRepository(remember { mutableStateListOf(*tasks.toTypedArray()) })
        MyApplicationTheme {
            TaskListScaffold(repository)
        }
    }
}
