package com.mongodb.app.presentation.tasks

import android.os.Bundle
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AbstractSavedStateViewModelFactory
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.savedstate.SavedStateRegistryOwner
import com.mongodb.app.data.SyncRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.launch

sealed class ToolbarEvent {
    object LogOut : ToolbarEvent()
    class Info(val message: String) : ToolbarEvent()
    class Error(val message: String, val throwable: Throwable) : ToolbarEvent()
}

class ToolbarViewModel(
    private val repository: SyncRepository
) : ViewModel() {

    private val _offlineMode: MutableState<Boolean> = mutableStateOf(false)
    val offlineMode: State<Boolean>
        get() = _offlineMode

    private val _toolbarEvent: MutableSharedFlow<ToolbarEvent> = MutableSharedFlow()
    val toolbarEvent: Flow<ToolbarEvent>
        get() = _toolbarEvent

    fun goOffline() {
        _offlineMode.value = true
        repository.pauseSync()
    }

    fun goOnline() {
        _offlineMode.value = false
        repository.resumeSync()
    }

    fun logOut() {
        viewModelScope.launch {
            _toolbarEvent.emit(ToolbarEvent.LogOut)
        }
    }

    fun error(errorEvent: ToolbarEvent.Error) {
        viewModelScope.launch {
            _toolbarEvent.emit(errorEvent)
        }
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
                    return ToolbarViewModel(repository) as T
                }
            }
        }
    }
}
