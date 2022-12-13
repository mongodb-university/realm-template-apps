package com.mongodb.app.ui.tasks

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Box
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.mongodb.app.R
import com.mongodb.app.data.MockRepository
import com.mongodb.app.domain.Item
import com.mongodb.app.presentation.tasks.ItemContextualMenuViewModel
import com.mongodb.app.presentation.tasks.TaskViewModel
import com.mongodb.app.ui.theme.MyApplicationTheme

@Composable
fun ItemContextualMenu(viewModel: ItemContextualMenuViewModel, task: Item) {
    Box(
        contentAlignment = Alignment.Center
    ) {
        IconButton(
            onClick = {
                viewModel.open()
            }
        ) {
            Icon(
                imageVector = Icons.Default.MoreVert,
                contentDescription = "Open Contextual Menu"
            )
        }

        DropdownMenu(
            expanded = viewModel.visible.value,
            onDismissRequest = {
                viewModel.close()
            }
        ) {
            DropdownMenuItem(
                text = { Text(text = stringResource(R.string.delete)) },
                onClick = {
                    viewModel.deleteTask(task)
                }
            )
        }
    }
}

@SuppressLint("UnrememberedMutableState")
@Preview(showBackground = true)
@Composable
fun ItemContextualMenuPreview() {
    MyApplicationTheme {
        MyApplicationTheme {
            val repository = MockRepository()
            ItemContextualMenu(
                ItemContextualMenuViewModel(
                    repository,
                    TaskViewModel(repository, mutableStateListOf())
                ),
                Item()
            )
        }
    }
}
