package com.mongodb.app.ui.tasks

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.Divider
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.ui.theme.MyApplicationTheme

@Composable
fun TaskList(repository: SyncRepository) {
    LazyColumn(
        state = rememberLazyListState(),
        modifier = Modifier.fillMaxWidth()
    ) {
        val taskList = repository.taskListState
        items(taskList.size) { index: Int ->
            TaskItem(repository, taskList[index])
            Divider()
        }
    }
}

@Preview(showBackground = true)
@Composable
fun TaskListPreview() {
    MyApplicationTheme {
        val tasks = (1..30).map { index ->
            MockRepository.getMockTask(index)
        }.toMutableList()
        val repository = MockRepository(remember { mutableStateListOf(*tasks.toTypedArray()) })
        MyApplicationTheme {
            TaskList(repository)
        }
    }
}
