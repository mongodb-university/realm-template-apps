package com.mongodb.app

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import io.realm.Realm
import io.realm.RealmConfiguration
import io.realm.kotlin.where
import io.realm.mongodb.sync.SyncConfiguration

class TaskActivity : AppCompatActivity() {
    private lateinit var userRealm: Realm
    private lateinit var config: RealmConfiguration
    private lateinit var recyclerView: RecyclerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_task)

        val toolbar = findViewById<View>(R.id.task_menu) as Toolbar
        setSupportActionBar(toolbar)
        toolbar.showOverflowMenu()

        val fab = findViewById<View>(R.id.floating_action_button) as FloatingActionButton
        fab.setOnClickListener { (onFabClicked()) }

        recyclerView = findViewById(R.id.task_list)
        recyclerView.layoutManager = LinearLayoutManager(this@TaskActivity)
        recyclerView.adapter = object : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
            override fun onCreateViewHolder(
                parent: ViewGroup,
                viewType: Int
            ): RecyclerView.ViewHolder {
                TODO("Not yet implemented")
            }
            override fun getItemCount(): Int {
                return 0
            }
            override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
            }
        }
        recyclerView.setHasFixedSize(true)
        recyclerView.addItemDecoration(DividerItemDecoration(this@TaskActivity, DividerItemDecoration.VERTICAL))
    }

    /**
     *  On start, open a realm with a partition ID equal to the user ID.
     *  Query the realm for Task objects, sorted by a stable order that remains
     *  consistent between runs, and display the collection using a recyclerView.
     */
    override fun onStart() {
        super.onStart()
        val user = realmApp.currentUser()
        if (user == null) {
            startActivity(Intent(this, LoginActivity::class.java))
        }
        else {
            val partition = user.id
            config = SyncConfiguration.Builder(user, partition).build()
            Realm.getInstanceAsync(config, object : Realm.Callback() {
                override fun onSuccess(realm: Realm) {
                    this@TaskActivity.userRealm = realm
                    val adapter = TaskAdapter(realm.where<Task>().sort("_id").findAll(), config)
                    adapter.notifyDataSetChanged()
                    recyclerView.adapter = adapter
                }
            })
        }
    }

    /**
     * Add buttons to the task menu.
     */
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.task_menu, menu)
        return true
    }

    /**
     *  Decides actions for all buttons on the task menu.
     *  When "log out" is tapped, logs out the user and brings them back to the login screen.
     */
    override fun onOptionsItemSelected(menuItem: MenuItem): Boolean {
        return when (menuItem.itemId) {
            R.id.action_logout -> {
                realmApp.currentUser()?.logOutAsync {
                    if (it.isSuccess) {
                        Log.v(TAG(), "user logged out")
                        startActivity(Intent(this, LoginActivity::class.java))
                    } else {
                        Log.e(TAG(), "log out failed! Error: ${it.error}")
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
     *  Creates a popup that allows the user to insert a task into the realm.
     */
    private fun onFabClicked() {
        val input = EditText(this)
        val dialogBuilder = AlertDialog.Builder(this)
        dialogBuilder.setMessage("Enter task name:")
                .setCancelable(true)
                .setPositiveButton("Create") { dialog, _ ->
                    run {
                        dialog.dismiss()
                        val task = Task()
                        task._partition = realmApp.currentUser()!!.id
                        task.summary = input.text.toString()
                        userRealm?.executeTransactionAsync { realm ->
                            realm.insert(task)
                        }
                    }
                }
                .setNegativeButton("Cancel") { dialog, _ ->
                    dialog.cancel()
                }
        val dialog = dialogBuilder.create()
        dialog.setView(input)
        dialog.setTitle("Add Task")
        dialog.show()
        input.requestFocus()
    }

    /**
     * Ensure the user realm closes when the activity ends.
     */
    override fun onDestroy() {
        super.onDestroy()
        userRealm?.close()
        recyclerView.adapter = null
    }

}
