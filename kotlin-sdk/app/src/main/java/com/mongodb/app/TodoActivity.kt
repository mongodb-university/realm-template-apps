package com.mongodb.app

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import io.realm.kotlin.Realm
import io.realm.kotlin.mongodb.sync.SyncConfiguration
import io.realm.kotlin.ext.query
import io.realm.kotlin.mongodb.subscriptions
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class TodoActivity : AppCompatActivity() {
    private lateinit var realm: Realm
    private lateinit var config: SyncConfiguration
    private lateinit var recyclerView: RecyclerView
    private lateinit var todoAdapter: TodoAdapter
    private val USER_TASKS = "user's todos"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_todo)

        val toolbar = findViewById<View>(R.id.todo_menu) as Toolbar
        setSupportActionBar(toolbar)

        val fab = findViewById<View>(R.id.floating_action_button)
        fab.setOnClickListener { (onFabClicked()) }

        recyclerView = findViewById(R.id.todo_list)
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.setHasFixedSize(true)
        recyclerView.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
    }

    /**
     *  On start, open a realm that contains todos for the current user.
     *  Query the realm for Task objects, sorted by a stable order that remains
     *  consistent between runs, and display the collection using a recyclerView.
     */
    override fun onStart() {
        super.onStart()
        val user = realmApp.currentUser
        if (user == null) {
            startActivity(Intent(this, LoginActivity::class.java))
        }
        else {
            config = SyncConfiguration.Builder(user, setOf(Todo::class))
                .initialSubscriptions { realm ->
                    add(
                        realm.query<Todo>(
                            "owner_id == $0",
                            realmApp.currentUser!!.identity
                        ),
                        USER_TASKS
                    )
                }
                .waitForInitialRemoteData()
                .build()
            this.realm = Realm.open(config)
            CoroutineScope(Dispatchers.IO).launch {
                realm.subscriptions.waitForSynchronization()
            }
            val query = realm.query<Todo>()
            todoAdapter = TodoAdapter(query.find(), realm, query.asFlow())
            recyclerView.adapter = todoAdapter
        }
    }

    /**
     * Add buttons to the todo menu.
     */
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.todo_menu, menu)
        return true
    }

    /**
     *  Decides actions for all buttons on the todo menu.
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
            else -> {
                super.onOptionsItemSelected(menuItem)
            }
        }
    }

    /**
     *  Creates a popup that allows the user to insert a todo into the realm.
     */
    private fun onFabClicked() {
        val input = EditText(this)
        val dialogBuilder = AlertDialog.Builder(this)
        dialogBuilder.setMessage("Enter todo name:")
                .setCancelable(true)
                .setPositiveButton("Create") { dialog, _ ->
                    run {
                        dialog.dismiss()
                        val todo = Todo(realmApp.currentUser!!.identity)
                        todo.summary = input.text.toString()
                        CoroutineScope(Dispatchers.IO).launch {
                            realm.write {
                                this.copyToRealm(todo)
                            }
                        }
                    }
                }
            .setNegativeButton("Cancel") { dialog, _ ->
                    dialog.cancel()
                }
        val dialog = dialogBuilder.create()
        dialog.setView(input)
        dialog.setTitle("Add ToDo")
        dialog.show()
        input.requestFocus()
    }

    /**
     * Ensure the user realm closes when the activity ends.
     */
    override fun onDestroy() {
        super.onDestroy()
        realm.close()
        recyclerView.adapter = null
    }

}
