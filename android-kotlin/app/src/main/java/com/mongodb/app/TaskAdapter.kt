package com.mongodb.app

import android.view.*
import android.widget.CheckBox
import android.widget.PopupMenu
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import io.realm.OrderedRealmCollection
import io.realm.Realm
import io.realm.RealmConfiguration
import io.realm.RealmRecyclerViewAdapter
import io.realm.kotlin.where
import org.bson.types.ObjectId

/**
 * Extends the Realm-provided RealmRecyclerViewAdapter to provide data
 * for a RecyclerView to display Realm objects on screen to a user.
 */
internal class TaskAdapter(data: OrderedRealmCollection<Task>, private val config: RealmConfiguration) : RealmRecyclerViewAdapter<Task, TaskAdapter.TaskViewHolder?>(data, true) {

    internal inner class TaskViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        var id: ObjectId? = null
        var name: TextView = view.findViewById(R.id.name)
        var menu: TextView = view.findViewById(R.id.popup_menu)
        var checkbox: CheckBox = view.findViewById(R.id.checkbox)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TaskViewHolder {
        val taskView = LayoutInflater.from(parent.context).inflate(R.layout.task_view, parent, false)
        return TaskViewHolder(taskView)
    }

    override fun onBindViewHolder(holder: TaskViewHolder, position: Int) {
        val task: Task = getItem(position) ?: return
        holder.id = task.id
        holder.name.text = task.summary
        holder.checkbox.isChecked = task.isComplete
        holder.checkbox.setOnClickListener { onCheckboxClicked(holder) }
        holder.menu.setOnClickListener { onMenuClicked(holder) }
    }

    /**
     *  Allows a user to check and uncheck a task and updates its status in the realm.
     */
    private fun onCheckboxClicked(holder: TaskViewHolder) {
        val realm: Realm = Realm.getInstance(config)
        realm.executeTransactionAsync {
            val task = it.where<Task>().equalTo("id", holder.id).findFirst()
            task?.isComplete = holder.checkbox.isChecked
        }
        realm.close()
    }

    /**
     *  Creates a popup menu that allows the user to delete a task from the realm.
     */
    private fun onMenuClicked(holder: TaskViewHolder) {
        val popup = PopupMenu(holder.itemView.context, holder.menu)
        popup.menu.add(0, R.id.action_delete, Menu.NONE, "Delete")
        popup.setOnMenuItemClickListener { menuItem: MenuItem ->
            when (menuItem.itemId) {
                R.id.action_delete -> {
                    val realm: Realm = Realm.getInstance(config)
                    realm.executeTransactionAsync {
                        val task = it.where<Task>().equalTo("id", holder.id).findFirst()
                        task?.deleteFromRealm()
                    }
                    realm.close()
                }
            }
            true
        }
        popup.show()
    }
}
