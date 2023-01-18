package com.mongodb.app.ui.tasks

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.mongodb.app.R
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.SubscriptionType
import com.mongodb.app.presentation.tasks.SubscriptionTypeViewModel
import com.mongodb.app.presentation.tasks.ToolbarViewModel
import com.mongodb.app.ui.theme.MyApplicationTheme
import com.mongodb.app.ui.theme.Purple200

@Composable
fun ShowMyOwnTasks(
    viewModel: SubscriptionTypeViewModel,
    toolbarViewModel: ToolbarViewModel
) {
    Row(
        modifier = Modifier
            .background(Color.LightGray)
            .fillMaxWidth()
            .padding(16.dp)
            .height(32.dp),
        horizontalArrangement = Arrangement.End,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = stringResource(R.string.show_all_tasks),
            color = Color.Black
        )
        Spacer(modifier = Modifier.padding(8.dp))
        OwnerSwitch(viewModel, toolbarViewModel)
    }
}

@Composable
fun OwnerSwitch(
    viewModel: SubscriptionTypeViewModel,
    toolbarViewModel: ToolbarViewModel
) {
    Switch(
        checked = when (viewModel.subscriptionType.value) {
            SubscriptionType.MINE -> false
            SubscriptionType.ALL -> true
        },
        onCheckedChange = {
            if (toolbarViewModel.offlineMode.value) {
                viewModel.showOfflineMessage()
            } else {
                val updatedSubscriptionType = when (viewModel.subscriptionType.value) {
                    SubscriptionType.MINE -> SubscriptionType.ALL
                    SubscriptionType.ALL -> SubscriptionType.MINE
                }
                viewModel.updateSubscription(updatedSubscriptionType)
            }
        },
        colors = SwitchDefaults.colors(
            checkedTrackColor = Purple200
        )
    )
}

@Preview(showBackground = true)
@Composable
fun ShowMyOwnTasksPreview() {
    MyApplicationTheme {
        val repository = MockRepository()
        MyApplicationTheme {
            ShowMyOwnTasks(
                SubscriptionTypeViewModel(repository),
                ToolbarViewModel(repository)
            )
        }
    }
}
