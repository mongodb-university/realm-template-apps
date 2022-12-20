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
import com.mongodb.app.data.SubscriptionType
import com.mongodb.app.data.SyncRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

sealed class SubscriptionTypeEvent {
    class Info(val message: String) : SubscriptionTypeEvent()
    object PermissionsEvent : SubscriptionTypeEvent()
    class Error(val message: String, val throwable: Throwable) : SubscriptionTypeEvent()
}

class SubscriptionTypeViewModel(
    private val repository: SyncRepository
) : ViewModel() {

    private val _subscriptionType: MutableState<SubscriptionType> =
        mutableStateOf(repository.getActiveSubscriptionType())
    val subscriptionType: State<SubscriptionType>
        get() = _subscriptionType

    private val _subscriptionTypeEvent: MutableSharedFlow<SubscriptionTypeEvent> =
        MutableSharedFlow()
    val subscriptionTypeEvent: Flow<SubscriptionTypeEvent>
        get() = _subscriptionTypeEvent

    fun updateSubscription(subscriptionType: SubscriptionType) {
        CoroutineScope(Dispatchers.IO).launch {
            runCatching {
                repository.updateSubscriptions(subscriptionType)
                _subscriptionType.value = subscriptionType
            }.onSuccess {
                withContext(Dispatchers.Main) {
                    _subscriptionTypeEvent.emit(SubscriptionTypeEvent.Info("Successfully switched to '${subscriptionType.name}'"))
                }
            }.onFailure {
                withContext(Dispatchers.Main) {
                    _subscriptionTypeEvent.emit(SubscriptionTypeEvent.Error("There was an error while switching to '${subscriptionType.name}'", it))
                }
            }
        }
    }

    fun showOfflineMessage() {
        viewModelScope.launch {
            _subscriptionTypeEvent.emit(SubscriptionTypeEvent.PermissionsEvent)
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
                    return SubscriptionTypeViewModel(repository) as T
                }
            }
        }
    }
}
