package com.mongodb.app.ui.tasks

import androidx.compose.foundation.layout.Box
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.mongodb.app.domain.Item
import com.mongodb.app.R
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.ui.theme.MyApplicationTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun ItemContextualMenu(repository: SyncRepository, task: Item) {
    val expanded: MutableState<Boolean> = remember { mutableStateOf(false) }

    Box(
        contentAlignment = Alignment.Center
    ) {
        IconButton(onClick = {
            expanded.value = true
        }) {
            Icon(
                imageVector = Icons.Default.MoreVert,
                contentDescription = "Open Contextual Menu"
            )
        }

        DropdownMenu(
            expanded = expanded.value,
            onDismissRequest = {
                expanded.value = false
            }
        ) {
            DropdownMenuItem(
                text = { Text(text = stringResource(R.string.delete)) },
                onClick = {
                    expanded.value = false
                    CoroutineScope(Dispatchers.IO).launch {
                        repository.deleteTask(task)
                    }
                }
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ItemContextualMenuPreview() {
    MyApplicationTheme {
        val repository = MockRepository(remember { mutableStateListOf() })
        MyApplicationTheme {
            ItemContextualMenu(repository, Item())
        }
    }
}
