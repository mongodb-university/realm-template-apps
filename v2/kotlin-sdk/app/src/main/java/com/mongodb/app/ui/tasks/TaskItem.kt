package com.mongodb.app.ui.tasks

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Checkbox
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.mongodb.app.domain.Item
import com.mongodb.app.R
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.ui.theme.Blue
import com.mongodb.app.ui.theme.MyApplicationTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun TaskItem(repository: SyncRepository, task: Item) {
    val context = LocalContext.current
    val itemText: MutableState<String> = remember {
        val text = when (repository.isTaskMine(task)) {
            true -> context.getString(R.string.mine)
            else -> "Someone else's - TODO" // TODO extract string to resources
        }
        mutableStateOf(text)
    }

//    val enabled: MutableState<Boolean> = remember {
//        mutableStateOf(repository.isTaskMine(task))
//    }

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .padding(horizontal = 16.dp)
            .fillMaxWidth()
            .height(80.dp)
    ) {
        Checkbox(
//            enabled = enabled.value,
            enabled = true,
            checked = task.isComplete,
            onCheckedChange = {
                CoroutineScope(Dispatchers.IO).launch {
                    repository.updateCompleteness(task)
                }
            }
        )
        Column {
            Text(
                text = task.summary,
                style = MaterialTheme.typography.bodyMedium,
                color = Blue,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = itemText.value,
                style = MaterialTheme.typography.bodySmall
            )
        }

        // Delete icon
        Row(
            horizontalArrangement = Arrangement.End,
            modifier = Modifier.fillMaxWidth()
        ) {
            ItemContextualMenu(repository, task)
        }
    }
}

@Preview(showBackground = true)
@Composable
fun TaskItemPreview() {
    MyApplicationTheme {
        MyApplicationTheme {
            TaskItem(
                MockRepository(remember { mutableStateListOf() }),
                MockRepository.getMockTask(42)
            )
        }
    }
}
