package com.mongodb.app.ui.tasks

import android.util.Log
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
            // If you're getting this app code by cloning the repository at
            // https://github.com/mongodb/template-app-kotlin-todo, 
            // it does not contain the data explorer link. Download the
            // app template from the Atlas UI to view a link to your data.
            var link = stringResource(R.string.realm_data_explorer_link)
            Button(
                colors = buttonColors(containerColor = Purple200),
                onClick = {
                    viewModel.addTask()
                    Log.v("TemplateApp","To see your data in Atlas, follow this link:"  + link)
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
