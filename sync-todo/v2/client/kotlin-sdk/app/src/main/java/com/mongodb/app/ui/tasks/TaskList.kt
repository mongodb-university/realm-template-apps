package com.mongodb.app.ui.tasks

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.Divider
import androidx.compose.runtime.Composable
import androidx.compose.runtime.toMutableStateList
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.presentation.tasks.ItemContextualMenuViewModel
import com.mongodb.app.presentation.tasks.TaskViewModel
import com.mongodb.app.ui.theme.MyApplicationTheme

@Composable
fun TaskList(
    repository: SyncRepository,
    taskViewModel: TaskViewModel
) {
    LazyColumn(
        state = rememberLazyListState(),
        modifier = Modifier.fillMaxWidth()
    ) {
        val taskList = taskViewModel.taskListState
        items(taskList.size) { index: Int ->
            TaskItem(
                taskViewModel,
                ItemContextualMenuViewModel(repository, taskViewModel),
                taskList[index]
            )
            Divider()
        }
    }
}

@Preview(showBackground = true)
@Composable
fun TaskListPreview() {
    MyApplicationTheme {
        val repository = MockRepository()
        val tasks = (1..30).map { index ->
            MockRepository.getMockTask(index)
        }.toMutableStateList()

        MyApplicationTheme {
            TaskList(repository, TaskViewModel(repository, tasks))
        }
    }
}
