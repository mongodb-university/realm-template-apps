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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.mongodb.app.R
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.domain.Item
import com.mongodb.app.presentation.tasks.ItemContextualMenuViewModel
import com.mongodb.app.presentation.tasks.TaskViewModel
import com.mongodb.app.ui.theme.Blue
import com.mongodb.app.ui.theme.MyApplicationTheme

@Composable
fun TaskItem(
    repository: SyncRepository,
    taskViewModel: TaskViewModel,
    itemContextualMenuViewModel: ItemContextualMenuViewModel,
    task: Item
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .padding(horizontal = 16.dp)
            .fillMaxWidth()
            .height(80.dp)
    ) {
        Checkbox(
            enabled = true,
            checked = task.isComplete,
            onCheckedChange = {
                taskViewModel.updateCompleteness(task)
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
                text = when (repository.isTaskMine(task)) {
                    true -> stringResource(R.string.mine)
                    false -> "Someone else's - TODO" // TODO extract string to resources
                },
                style = MaterialTheme.typography.bodySmall
            )
        }

        // Delete icon
        Row(
            horizontalArrangement = Arrangement.End,
            modifier = Modifier.fillMaxWidth()
        ) {
            ItemContextualMenu(itemContextualMenuViewModel, task)
        }
    }
}

@Preview(showBackground = true)
@Composable
fun TaskItemPreview() {
    MyApplicationTheme {
        val repository = MockRepository()
        TaskItem(
            repository,
            TaskViewModel(repository),
            ItemContextualMenuViewModel(repository),
            MockRepository.getMockTask(42)
        )
    }
}
