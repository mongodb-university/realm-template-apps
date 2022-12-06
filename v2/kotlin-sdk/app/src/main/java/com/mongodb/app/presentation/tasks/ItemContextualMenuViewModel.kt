package com.mongodb.app.presentation.tasks

import androidx.compose.runtime.MutableState
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.mongodb.app.data.SyncRepository
import com.mongodb.app.domain.Item
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class ItemContextualMenuViewModel(
    private val repository: SyncRepository
) : ViewModel() {

    private val _visible: MutableState<Boolean> = mutableStateOf(false)
    val visible: State<Boolean>
        get() = _visible

    fun open() {
        _visible.value = true
    }

    fun close() {
        _visible.value = false
    }

    fun deleteTask(task: Item) {
        CoroutineScope(Dispatchers.IO).launch {
            runCatching {
                repository.deleteTask(task)
                close()
            }
        }
    }
}
