package com.mongodb.app.presentation.tasks

import android.os.Bundle
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AbstractSavedStateViewModelFactory
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.savedstate.SavedStateRegistryOwner
import com.mongodb.app.data.SyncRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

sealed class AddItemEvent {
    class Info(val message: String) : AddItemEvent()
    class Error(val message: String, val throwable: Throwable) : AddItemEvent()
}

class AddItemViewModel(
    private val repository: SyncRepository
) : ViewModel() {

    private val _addItemPopupVisible: MutableState<Boolean> = mutableStateOf(false)
    val addItemPopupVisible: State<Boolean>
        get() = _addItemPopupVisible

    private val _taskSummary: MutableState<String> = mutableStateOf("")
    val taskSummary: State<String>
        get() = _taskSummary

    private val _addItemEvent: MutableSharedFlow<AddItemEvent> = MutableSharedFlow()
    val addItemEvent: Flow<AddItemEvent>
        get() = _addItemEvent

    fun openAddTaskDialog() {
        _addItemPopupVisible.value = true
    }

    fun closeAddTaskDialog() {
        cleanUpAndClose()
    }

    fun updateTaskSummary(taskSummary: String) {
        _taskSummary.value = taskSummary
    }

    fun addTask() {
        CoroutineScope(Dispatchers.IO).launch {
            runCatching {
                repository.addTask(taskSummary.value)
            }.onSuccess {
                withContext(Dispatchers.Main) {
                    _addItemEvent.emit(AddItemEvent.Info("Task '$taskSummary' added successfully."))
                }
            }.onFailure {
                withContext(Dispatchers.Main) {
                    _addItemEvent.emit(AddItemEvent.Error("There was an error while adding the task '$taskSummary'", it))
                }
            }
            cleanUpAndClose()
        }
    }

    private fun cleanUpAndClose() {
        _taskSummary.value = ""
        _addItemPopupVisible.value = false
    }

    companion object {
        fun factory(
            repository: SyncRepository,
            owner: SavedStateRegistryOwner,
            defaultArgs: Bundle? = null
        ): AbstractSavedStateViewModelFactory {
            return object : AbstractSavedStateViewModelFactory(owner, defaultArgs) {
                override fun <T : ViewModel> create(
                    key: String,
                    modelClass: Class<T>,
                    handle: SavedStateHandle
                ): T {
                    return AddItemViewModel(repository) as T
                }
            }
        }
    }
}
