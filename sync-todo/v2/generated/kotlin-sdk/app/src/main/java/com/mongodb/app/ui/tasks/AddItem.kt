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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.mongodb.app.R
import com.mongodb.app.data.MockRepository
import com.mongodb.app.presentation.tasks.AddItemViewModel
import com.mongodb.app.ui.theme.MyApplicationTheme
import com.mongodb.app.ui.theme.Purple200

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddItemPrompt(viewModel: AddItemViewModel) {
    AlertDialog(
        containerColor = Color.White,
        onDismissRequest = {
            viewModel.closeAddTaskDialog()
        },
        title = { Text(stringResource(R.string.add_item)) },
        text = {
            Column {
                Text(stringResource(R.string.enter_item_name))
                TextField(
                    colors = ExposedDropdownMenuDefaults.textFieldColors(containerColor = Color.White),
                    value = viewModel.taskSummary.value,
                    maxLines = 2,
                    onValueChange = {
                        viewModel.updateTaskSummary(it)
                    },
                    label = { Text(stringResource(R.string.item_summary)) }
                )
            }
        },
        confirmButton = {
            Button(
                colors = buttonColors(containerColor = Purple200),
                onClick = {
                    viewModel.addTask()
                }
            ) {
                Text(stringResource(R.string.create))
            }
        },
        dismissButton = {
            Button(
                colors = buttonColors(containerColor = Purple200),
                onClick = {
                    viewModel.closeAddTaskDialog()
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
            val repository = MockRepository()
            val viewModel = AddItemViewModel(repository)
            AddItemPrompt(viewModel)
        }
    }
}
