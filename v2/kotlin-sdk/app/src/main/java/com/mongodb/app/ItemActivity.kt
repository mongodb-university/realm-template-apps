package com.mongodb.app

import android.app.AlertDialog
import android.content.Intent
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.switchmaterial.SwitchMaterial
import com.mongodb.app.domain.Item
import io.realm.kotlin.Realm
import io.realm.kotlin.ext.query
import io.realm.kotlin.mongodb.subscriptions
import io.realm.kotlin.mongodb.sync.SyncConfiguration
import io.realm.kotlin.mongodb.syncSession
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlin.time.Duration.Companion.seconds

private const val SUBSCRIPTION_MINE = "SUBSCRIPTION_MINE"
private const val SUBSCRIPTION_MINE_COMPLETED = "SUBSCRIPTION_MINE_COMPLETED"

class ItemActivity : AppCompatActivity() {

    private lateinit var realm: Realm
    private lateinit var config: SyncConfiguration
    private lateinit var recyclerView: RecyclerView
    private lateinit var itemAdapter: ItemAdapter
    private lateinit var airplaneModeItem: MenuItem
    private lateinit var filterSwitch: SwitchMaterial
    private lateinit var fab: View

    private var connectivityEnabled = true
    private var syncDisabledIcon: Drawable? = null
    private var syncEnabledIcon: Drawable? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_item)

        val toolbar = findViewById<View>(R.id.item_menu) as Toolbar
        setSupportActionBar(toolbar)

        fab = findViewById<View>(R.id.floating_action_button)
        fab.setOnClickListener { onFabClicked() }

        initializeResources()

        filterSwitch = findViewById(R.id.filter_switch)

        recyclerView = findViewById(R.id.item_list)
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.setHasFixedSize(true)
        recyclerView.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
    }

    /**
     *  On start, open a realm that contains items for the current user.
     *  Query the realm for 'Item' objects, sorted by a stable order that remains
     *  consistent between runs, and display the collection using a recyclerView.
     */
    override fun onStart() {
        super.onStart()
        val user = realmApp.currentUser
        if (user == null) {
            startActivity(Intent(this, LoginActivity::class.java))
        } else {
            config = SyncConfiguration.Builder(user, setOf(Item::class))
                .initialSubscriptions { realm ->
                    add(
                        realm.query<Item>("owner_id == $0", realmApp.currentUser!!.id),
                        "User's Items"
                    )
                }
                .waitForInitialRemoteData()
                .build()
            this.realm = Realm.open(config)
            CoroutineScope(Dispatchers.IO).launch {
                realm.subscriptions.waitForSynchronization()
            }
            val query = realm.query<Item>()
            itemAdapter = ItemAdapter(query.find(), realm, query.asFlow())
            recyclerView.adapter = itemAdapter

            filterSwitch.setOnCheckedChangeListener { _, isChecked ->
                // Disallow adding tasks when only filtering by completed tasks
//                fab.isEnabled = !isChecked

                CoroutineScope(Dispatchers.IO).launch {
                    realm.subscriptions.update {
                        val queryMine = realm.query<Item>("owner_id == $0", realmApp.currentUser!!.id)
                        val queryMineCompleted = realm.query<Item>("owner_id == $0 && isComplete == $1", realmApp.currentUser!!.id, true)

                        if (isChecked) {
                            removeAll()
                            queryMineCompleted.subscribe(SUBSCRIPTION_MINE_COMPLETED)
                        } else {
                            removeAll()
                            queryMine.subscribe(SUBSCRIPTION_MINE)
                        }
                    }
                    realm.subscriptions.waitForSynchronization(10.seconds)
                }
            }
        }
    }

    /**
     * Add buttons to the item menu.
     */
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.item_menu, menu)
        airplaneModeItem = menu.findItem(R.id.action_airplane_mode)

        if (this::realm.isInitialized) {
            if (connectivityEnabled) {
                airplaneModeItem.icon = syncEnabledIcon
                realm.syncSession.resume()
            } else {
                airplaneModeItem.icon = syncDisabledIcon
                realm.syncSession.pause()
            }
        }

        return true
    }

    /**
     *  Decides actions for all buttons on the item menu.
     *  When "log out" is tapped, logs out the user and brings them back to the login screen.
     */
    override fun onOptionsItemSelected(menuItem: MenuItem): Boolean {
        return when (menuItem.itemId) {
            R.id.action_logout -> {
                CoroutineScope(Dispatchers.IO).launch {
                    runCatching {
                        realmApp.currentUser?.logOut()
                    }.onSuccess {
                        Log.v(TAG(), "user logged out")
                        withContext(Dispatchers.Main) {
                            startActivity(Intent(application, LoginActivity::class.java))
                        }
                    }.onFailure { ex: Throwable ->
                        Log.e(TAG(), "log out failed! Error: ${ex.message}")
                    }
                }
                true
            }
            R.id.action_airplane_mode -> {
                if (connectivityEnabled) {
                    connectivityEnabled = false
                    airplaneModeItem.icon = syncDisabledIcon
                    realm.syncSession.pause()
                } else {
                    connectivityEnabled = true
                    airplaneModeItem.icon = syncEnabledIcon
                    realm.syncSession.resume()
                }
                true
            }
            else -> {
                super.onOptionsItemSelected(menuItem)
            }
        }
    }

    /**
     * Ensure the user realm closes when the activity ends.
     */
    override fun onDestroy() {
        super.onDestroy()
        realm.close()
        recyclerView.adapter = null
    }

    /**
     *  Creates a popup that allows the user to insert a item into the realm.
     */
    private fun onFabClicked() {
        val dialogBuilder = AlertDialog.Builder(this)
            .setMessage("Enter Item Name:")
        val view: View = layoutInflater.inflate(R.layout.create_item_dialog, null)

        val itemSummaryInput = view.findViewById<View>(R.id.plain_text_input) as EditText

        dialogBuilder
            .setPositiveButton("Create") { _, _ ->
                run {
                    val item = Item(realmApp.currentUser!!.id)
                    item.summary = itemSummaryInput.text.toString()

                    CoroutineScope(Dispatchers.IO).launch {
                        realm.write {
                            this.copyToRealm(item)
                        }
                    }

                    // Display the item created using Android's Toast feedback popup
                    Toast.makeText(
                        this,
                        "Item created: ${item.summary}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            .setNegativeButton("Cancel") { dialog, _ ->
                dialog.cancel()
            }

        dialogBuilder.setView(view)
        val dialog = dialogBuilder.create()
        dialog.setTitle("Add Item")
        dialog.show()
    }

    private fun initializeResources() {
        syncDisabledIcon = ContextCompat.getDrawable(
            this,
            R.drawable.ic_baseline_wifi_off_24_white
        )
        syncEnabledIcon = ContextCompat.getDrawable(
            this,
            R.drawable.ic_baseline_wifi_24_white
        )
    }
}


//package com.mongodb.app
//
//import android.app.AlertDialog
//import android.content.Intent
//import android.graphics.drawable.Drawable
//import android.os.Bundle
//import android.util.Log
//import android.view.Menu
//import android.view.MenuItem
//import android.view.View
//import android.widget.EditText
//import android.widget.Toast
//import androidx.appcompat.app.AppCompatActivity
//import androidx.appcompat.widget.Toolbar
//import androidx.core.content.ContextCompat
//import androidx.core.view.isVisible
//import androidx.recyclerview.widget.DividerItemDecoration
//import androidx.recyclerview.widget.LinearLayoutManager
//import androidx.recyclerview.widget.RecyclerView
//import com.google.android.material.switchmaterial.SwitchMaterial
//import io.realm.kotlin.Realm
//import io.realm.kotlin.ext.query
//import io.realm.kotlin.mongodb.subscriptions
//import io.realm.kotlin.mongodb.sync.Subscription
//import io.realm.kotlin.mongodb.sync.SyncConfiguration
//import io.realm.kotlin.mongodb.syncSession
//import kotlinx.coroutines.CoroutineScope
//import kotlinx.coroutines.Dispatchers
//import kotlinx.coroutines.launch
//import kotlinx.coroutines.withContext
//import kotlin.time.Duration.Companion.seconds
//
//private const val SUBSCRIPTION_MINE = "SUBSCRIPTION_MINE"
//private const val SUBSCRIPTION_MINE_COMPLETED = "SUBSCRIPTION_MINE_COMPLETED"
//
//class ItemActivity : AppCompatActivity() {
//
//    private lateinit var realm: Realm
//    private lateinit var config: SyncConfiguration
//    private lateinit var recyclerView: RecyclerView
//    private lateinit var itemAdapter: ItemAdapter
//    private lateinit var airplaneModeItem: MenuItem
//    private lateinit var filterSwitch: SwitchMaterial
//    private lateinit var fab: View
//
//    private lateinit var subscriptionMine: Subscription
//    private lateinit var subscriptionMineCompleted: Subscription
//
//    private var connectivityEnabled = true
//    private var syncDisabledIcon: Drawable? = null
//    private var syncEnabledIcon: Drawable? = null
//
//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//        setContentView(R.layout.activity_item)
//
//        val toolbar = findViewById<View>(R.id.item_menu) as Toolbar
//        setSupportActionBar(toolbar)
//
//        fab = findViewById<View>(R.id.floating_action_button)
//        fab.setOnClickListener { onFabClicked() }
//
//        initializeResources()
//
//        filterSwitch = findViewById(R.id.filter_switch)
//
//        recyclerView = findViewById(R.id.item_list)
//        recyclerView.layoutManager = LinearLayoutManager(this)
//        recyclerView.setHasFixedSize(true)
//        recyclerView.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
//    }
//
//    /**
//     *  On start, open a realm that contains items for the current user.
//     *  Query the realm for 'Item' objects, sorted by a stable order that remains
//     *  consistent between runs, and display the collection using a recyclerView.
//     */
//    override fun onStart() {
//        super.onStart()
//        val user = realmApp.currentUser
//        if (user == null) {
//            startActivity(Intent(this, LoginActivity::class.java))
//        } else {
//            config = SyncConfiguration.Builder(user, setOf(Item::class))
//                .initialSubscriptions { realm ->
//                    add(
//                        realm.query<Item>("owner_id == $0", realmApp.currentUser!!.id),
//                        "User's Items"
//                    )
//                }
//                .waitForInitialRemoteData()
//                .build()
//            this.realm = Realm.open(config)
//            CoroutineScope(Dispatchers.IO).launch {
//                realm.subscriptions.waitForSynchronization()
//            }
//            val query = realm.query<Item>()
//            itemAdapter = ItemAdapter(query.find(), realm, query.asFlow())
//            recyclerView.adapter = itemAdapter
//
//            filterSwitch.setOnCheckedChangeListener { _, isChecked ->
//                // Disallow adding tasks when only filtering by completed tasks
////                fab.isEnabled = !isChecked
//
//                CoroutineScope(Dispatchers.IO).launch {
//                    realm.subscriptions.update {
//                        val queryMine = realm.query<Item>("owner_id == $0", realmApp.currentUser!!.id)
//                        val queryMineCompleted = realm.query<Item>("owner_id == $0 && isComplete == $1", realmApp.currentUser!!.id, true)
//
//                        if (isChecked) {
//                            removeAll()
//                            queryMineCompleted.subscribe(SUBSCRIPTION_MINE_COMPLETED)
//                        } else {
//                            removeAll()
//                            queryMine.subscribe(SUBSCRIPTION_MINE)
//                        }
//                    }
//                    realm.subscriptions.waitForSynchronization(10.seconds)
//                }
//            }
//        }
//    }
//
//    /**
//     * Add buttons to the item menu.
//     */
//    override fun onCreateOptionsMenu(menu: Menu): Boolean {
//        menuInflater.inflate(R.menu.item_menu, menu)
//        airplaneModeItem = menu.findItem(R.id.action_airplane_mode)
//
//        if (this::realm.isInitialized) {
//            if (connectivityEnabled) {
//                airplaneModeItem.icon = syncEnabledIcon
//                realm.syncSession.resume()
//            } else {
//                airplaneModeItem.icon = syncDisabledIcon
//                realm.syncSession.pause()
//            }
//        }
//
//        return true
//    }
//
//    /**
//     *  Decides actions for all buttons on the item menu.
//     *  When "log out" is tapped, logs out the user and brings them back to the login screen.
//     */
//    override fun onOptionsItemSelected(menuItem: MenuItem): Boolean {
//        return when (menuItem.itemId) {
//            R.id.action_logout -> {
//                CoroutineScope(Dispatchers.IO).launch {
//                    runCatching {
//                        realmApp.currentUser?.logOut()
//                    }.onSuccess {
//                        Log.v(TAG(), "user logged out")
//                        withContext(Dispatchers.Main) {
//                            startActivity(Intent(application, LoginActivity::class.java))
//                        }
//                    }.onFailure { ex: Throwable ->
//                        Log.e(TAG(), "log out failed! Error: ${ex.message}")
//                    }
//                }
//                true
//            }
//            R.id.action_airplane_mode -> {
//                if (connectivityEnabled) {
//                    connectivityEnabled = false
//                    airplaneModeItem.icon = syncDisabledIcon
//                    realm.syncSession.pause()
//                } else {
//                    connectivityEnabled = true
//                    airplaneModeItem.icon = syncEnabledIcon
//                    realm.syncSession.resume()
//                }
//                true
//            }
//            else -> {
//                super.onOptionsItemSelected(menuItem)
//            }
//        }
//    }
//
//    /**
//     * Ensure the user realm closes when the activity ends.
//     */
//    override fun onDestroy() {
//        super.onDestroy()
//        realm.close()
//        recyclerView.adapter = null
//    }
//
//    /**
//     *  Creates a popup that allows the user to insert a item into the realm.
//     */
//    private fun onFabClicked() {
//        val dialogBuilder = AlertDialog.Builder(this)
//            .setMessage("Enter Item Name:")
//        val view: View = layoutInflater.inflate(R.layout.create_item_dialog, null)
//
//        val itemSummaryInput = view.findViewById<View>(R.id.plain_text_input) as EditText
//
//        dialogBuilder
//            .setPositiveButton("Create") { _, _ ->
//                run {
//                    val item = Item(realmApp.currentUser!!.id)
//                    item.summary = itemSummaryInput.text.toString()
//
//                    CoroutineScope(Dispatchers.IO).launch {
//                        realm.write {
//                            this.copyToRealm(item)
//                        }
//                    }
//
//                    // Display the item created using Android's Toast feedback popup
//                    Toast.makeText(
//                        this,
//                        "Item created: ${item.summary}",
//                        Toast.LENGTH_SHORT
//                    ).show()
//                }
//            }
//            .setNegativeButton("Cancel") { dialog, _ ->
//                dialog.cancel()
//            }
//
//        dialogBuilder.setView(view)
//        val dialog = dialogBuilder.create()
//        dialog.setTitle("Add Item")
//        dialog.show()
//    }
//
//    private fun initializeResources() {
//        syncDisabledIcon = ContextCompat.getDrawable(
//            this,
//            R.drawable.ic_baseline_wifi_off_24_white
//        )
//        syncEnabledIcon = ContextCompat.getDrawable(
//            this,
//            R.drawable.ic_baseline_wifi_24_white
//        )
//    }
//}
