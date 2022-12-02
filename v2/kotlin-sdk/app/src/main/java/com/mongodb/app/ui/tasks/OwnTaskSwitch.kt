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
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.mongodb.app.R
import com.mongodb.app.data.MockRepository
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.data.SubscriptionType
import com.mongodb.app.ui.theme.MyApplicationTheme
import com.mongodb.app.ui.theme.Purple200
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun ShowMyOwnTasks(repository: SyncRepository) {
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
        OwnerSwitch(repository)
    }
}

@Composable
fun OwnerSwitch(repository: SyncRepository) {
    val checkedState = remember {
        mutableStateOf(repository.getActiveSubscriptionType())
    }

    Switch(
        checked = when (checkedState.value) {
            SubscriptionType.MINE -> false
            SubscriptionType.ALL -> true
        },
        onCheckedChange = {
            checkedState.value = when (checkedState.value) {
                SubscriptionType.MINE -> SubscriptionType.ALL
                SubscriptionType.ALL -> SubscriptionType.MINE
            }
            CoroutineScope(Dispatchers.IO).launch {
                repository.updateSubscriptions(checkedState.value)
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
        val repository = MockRepository(remember { mutableStateListOf() })
        MyApplicationTheme {
            ShowMyOwnTasks(repository)
        }
    }
}
