package com.mongodb.app.ui.tasks

import androidx.compose.foundation.layout.Column
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults.buttonColors
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.mongodb.app.R
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.ui.theme.MyApplicationTheme
import com.mongodb.app.ui.theme.Purple200
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddItem(
    repository: SyncRepository,
    openDialog: MutableState<Boolean>,
    taskSummary: MutableState<String>
) {

    fun dismissDialog() {
        openDialog.value = false
        taskSummary.value = ""
    }

    AlertDialog(
        containerColor = Color.White,
        onDismissRequest = {
            dismissDialog()
        },
        title = { Text(stringResource(R.string.add_item)) },
        text = {
            Column {
                Text(stringResource(R.string.enter_item_name))
                TextField(
                    colors = ExposedDropdownMenuDefaults.textFieldColors(containerColor = Color.White),
                    value = taskSummary.value,
                    maxLines = 2,
                    onValueChange = {
                        taskSummary.value = it
                    },
                    label = { Text(stringResource(R.string.item_summary)) }
                )
            }
        },
        confirmButton = {
            Button(
                colors = buttonColors(containerColor = Purple200),
                onClick = {
                    openDialog.value = false
                    CoroutineScope(Dispatchers.IO).launch {
                        repository.addTask(taskSummary.value)
                    }
                }
            ) {
                Text(stringResource(R.string.create))
            }
        },
        dismissButton = {
            Button(
                colors = buttonColors(containerColor = Purple200),
                onClick = {
                    dismissDialog()
                }
            ) {
                Text(stringResource(R.string.cancel))
            }
        },
    )
}

@Preview(showBackground = true)
@Composable
fun AddItemPreview() {
    MyApplicationTheme {
        MyApplicationTheme {
            val repository = MockRepository(remember { mutableStateListOf() })
            AddItem(
                repository = repository,
                openDialog = remember { mutableStateOf(false) },
                taskSummary = remember { mutableStateOf("") })
        }
    }
}
