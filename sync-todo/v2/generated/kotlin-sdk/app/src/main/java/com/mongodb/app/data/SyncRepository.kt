package com.mongodb.app.data

import com.mongodb.app.domain.Item
import com.mongodb.app.app
import io.realm.kotlin.Realm
import io.realm.kotlin.ext.query
import io.realm.kotlin.mongodb.User
import io.realm.kotlin.mongodb.exceptions.SyncException
import io.realm.kotlin.mongodb.subscriptions
import io.realm.kotlin.mongodb.sync.SyncConfiguration
import io.realm.kotlin.mongodb.sync.SyncSession
import io.realm.kotlin.mongodb.syncSession
import io.realm.kotlin.notifications.ResultsChange
import io.realm.kotlin.query.RealmQuery
import io.realm.kotlin.query.Sort
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.launch
import kotlin.time.Duration.Companion.seconds

/**
 * Repository for accessing Realm Sync.
 */
interface SyncRepository {

    /**
     * Returns a flow with the tasks for the current subscription.
     */
    fun getTaskList(): Flow<ResultsChange<Item>>

    /**
     * Update the `isComplete` flag for a specific [Item].
     */
    suspend fun toggleIsComplete(task: Item)

    /**
     * Adds a task that belongs to the current user using the specified [taskSummary].
     */
    suspend fun addTask(taskSummary: String)

    /**
     * Updates the Sync subscriptions based on the specified [SubscriptionType].
     */
    suspend fun updateSubscriptions(subscriptionType: SubscriptionType)

    /**
     * Deletes a given task.
     */
    suspend fun deleteTask(task: Item)

    /**
     * Returns the active [SubscriptionType].
     */
    fun getActiveSubscriptionType(realm: Realm? = null): SubscriptionType

    /**
     * Pauses synchronization with MongoDB. This is used to emulate a scenario of no connectivity.
     */
    fun pauseSync()

    /**
     * Resumes synchronization with MongoDB.
     */
    fun resumeSync()

    /**
     * Whether the given [task] belongs to the current user logged in to the app.
     */
    fun isTaskMine(task: Item): Boolean

    /**
     * Closes the realm instance held by this repository.
     */
    fun close()
}

/**
 * Repo implementation used in runtime.
 */
class RealmSyncRepository(
    onSyncError: (session: SyncSession, error: SyncException) -> Unit
) : SyncRepository {

    private val realm: Realm
    private val config: SyncConfiguration
    private val currentUser: User
        get() = app.currentUser!!

    init {
        config = SyncConfiguration.Builder(currentUser, setOf(Item::class))
            .initialSubscriptions { realm ->
                // Subscribe to the active subscriptionType - first time defaults to MINE
                val activeSubscriptionType = getActiveSubscriptionType(realm)
                add(getQuery(realm, activeSubscriptionType), activeSubscriptionType.name)
            }
            .errorHandler { session: SyncSession, error: SyncException ->
                onSyncError.invoke(session, error)
            }
            .waitForInitialRemoteData()
            .build()

        realm = Realm.open(config)

        // Mutable states must be updated on the UI thread
        CoroutineScope(Dispatchers.Main).launch {
            realm.subscriptions.waitForSynchronization()
        }
    }

    override fun getTaskList(): Flow<ResultsChange<Item>> {
        return realm.query<Item>()
            .sort(Pair("_id", Sort.ASCENDING))
            .asFlow()
    }

    override suspend fun toggleIsComplete(task: Item) {
        realm.write {
            val latestVersion = findLatest(task)
            latestVersion!!.isComplete = !latestVersion.isComplete
        }
    }

    override suspend fun addTask(taskSummary: String) {
        val task = Item().apply {
            owner_id = currentUser.id
            summary = taskSummary
        }
        realm.write {
            copyToRealm(task)
        }
    }

    override suspend fun updateSubscriptions(subscriptionType: SubscriptionType) {
        realm.subscriptions.update {
            removeAll()
            val query = when (subscriptionType) {
                SubscriptionType.MINE -> getQuery(realm, SubscriptionType.MINE)
                SubscriptionType.ALL -> getQuery(realm, SubscriptionType.ALL)
            }
            add(query, subscriptionType.name)
        }
    }

    override suspend fun deleteTask(task: Item) {
        realm.write {
            delete(findLatest(task)!!)
        }
        realm.subscriptions.waitForSynchronization(10.seconds)
    }

    override fun getActiveSubscriptionType(realm: Realm?): SubscriptionType {
        val realmInstance = realm ?: this.realm
        val subscriptions = realmInstance.subscriptions
        val firstOrNull = subscriptions.firstOrNull()
        return when (val name = firstOrNull?.name) {
            null,
            SubscriptionType.MINE.name -> SubscriptionType.MINE
            SubscriptionType.ALL.name -> SubscriptionType.ALL
            else -> throw IllegalArgumentException("Invalid Realm Sync subscription: '$name'")
        }
    }

    override fun pauseSync() {
        realm.syncSession.pause()
    }

    override fun resumeSync() {
        realm.syncSession.resume()
    }

    override fun isTaskMine(task: Item): Boolean = task.owner_id == currentUser.id

    override fun close() = realm.close()

    private fun getQuery(realm: Realm, subscriptionType: SubscriptionType): RealmQuery<Item> =
        when (subscriptionType) {
            SubscriptionType.MINE -> realm.query("owner_id == $0", currentUser.id)
            SubscriptionType.ALL -> realm.query()
        }
}

/**
 * Mock repo for generating the Compose layout preview.
 */
class MockRepository : SyncRepository {
    override fun getTaskList(): Flow<ResultsChange<Item>> = flowOf()
    override suspend fun toggleIsComplete(task: Item) = Unit
    override suspend fun addTask(taskSummary: String) = Unit
    override suspend fun updateSubscriptions(subscriptionType: SubscriptionType) = Unit
    override suspend fun deleteTask(task: Item) = Unit
    override fun getActiveSubscriptionType(realm: Realm?): SubscriptionType = SubscriptionType.ALL
    override fun pauseSync() = Unit
    override fun resumeSync() = Unit
    override fun isTaskMine(task: Item): Boolean = task.owner_id == MOCK_OWNER_ID_MINE
    override fun close() = Unit

    companion object {
        const val MOCK_OWNER_ID_MINE = "A"
        const val MOCK_OWNER_ID_OTHER = "B"

        fun getMockTask(index: Int): Item = Item().apply {
            this.summary = "Task $index"

            // Make every third task complete in preview
            this.isComplete = index % 3 == 0

            // Make every other task mine in preview
            this.owner_id = when {
                index % 2 == 0 -> MOCK_OWNER_ID_MINE
                else -> MOCK_OWNER_ID_OTHER
            }
        }
    }
}

/**
 * The two types of subscriptions according to item owner.
 */
enum class SubscriptionType {
    MINE, ALL
}
