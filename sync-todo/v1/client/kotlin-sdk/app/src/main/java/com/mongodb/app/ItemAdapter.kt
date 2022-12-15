package com.mongodb.app

import android.view.*
import android.widget.CheckBox
import android.widget.PopupMenu
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import io.realm.kotlin.Realm
import io.realm.kotlin.ext.query
import io.realm.kotlin.types.ObjectId
import io.realm.kotlin.notifications.ResultsChange
import io.realm.kotlin.notifications.UpdatedResults
import io.realm.kotlin.query.RealmResults
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch

/**
 * Extends the Realm-provided RealmRecyclerViewAdapter to provide data
 * for a RecyclerView to display Realm objects on screen to a user.
 */
internal class ItemAdapter(private var data: RealmResults<Item>, private val realm: Realm, private val listener: Flow<ResultsChange<Item>>)
    : RecyclerView.Adapter<ItemAdapter.ItemViewHolder>() {

    // event handler to update the UI when any change to underlying data occurs
    init {
        CoroutineScope(Dispatchers.IO).launch {
            listener.collect { event: ResultsChange<Item> ->
                when(event) {
                    is UpdatedResults -> {
                        // if an update occurred, update the frozen list of data in the background
                        data = event.list
                        if (event.deletions.isNotEmpty()) {
                            event.deletions.forEach {
                                notifyItemRemoved(it)
                            }
                        } else if (event.insertions.isNotEmpty()) {
                            event.insertions.forEach {
                                notifyItemInserted(it)
                            }
                        } else if (event.changes.isNotEmpty()) {
                            event.changes.forEach {
                                notifyItemChanged(it)
                            }
                        }
                    }
                }
            }
        }
    }

    internal inner class ItemViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        var id: ObjectId? = null
        var name: TextView = view.findViewById(R.id.name)
        var menu: TextView = view.findViewById(R.id.popup_menu)
        var checkbox: CheckBox = view.findViewById(R.id.checkbox)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.item_view, parent, false)
        return ItemViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        val item: Item = data[position]
        holder.id = item._id
        holder.name.text = item.summary
        holder.checkbox.isChecked = item.isComplete
        holder.checkbox.setOnClickListener { onCheckboxClicked(holder) }
        holder.menu.setOnClickListener { onMenuClicked(holder) }
    }

    /**
     *  Allows a user to check and uncheck an item and updates its status in the realm.
     */
    private fun onCheckboxClicked(holder: ItemViewHolder) {
        CoroutineScope(Dispatchers.IO).launch {
            realm.write {
                val item: Item = this.query<Item>(
                    "_id == $0",
                    holder.id
                ).find().first()
                item.isComplete = holder.checkbox.isChecked
            }
        }
    }

    /**
     *  Creates a popup menu that allows the user to delete a item from the realm.
     */
    private fun onMenuClicked(holder: ItemViewHolder) {
        val popup = PopupMenu(holder.itemView.context, holder.menu)
        popup.menu.add(0, R.id.action_delete, Menu.NONE, "Delete")
        popup.setOnMenuItemClickListener { menuItem: MenuItem ->
            when (menuItem.itemId) {
                R.id.action_delete -> {
                    CoroutineScope(Dispatchers.IO).launch {
                        realm.write {
                            val item: Item = this.query<Item>(
                                "_id == $0",
                                holder.id
                            ).find().first()
                            delete(item)
                        }
                    }
                }
            }
            true
        }
        popup.show()
    }

    override fun getItemCount(): Int {
        return data.size
    }
}
