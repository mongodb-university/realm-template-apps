package com.mongodb.app

import android.view.*
import android.widget.PopupMenu
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import io.realm.OrderedRealmCollection
import io.realm.Realm
import io.realm.RealmRecyclerViewAdapter
import io.realm.kotlin.where
import io.realm.mongodb.sync.SyncConfiguration
import org.bson.types.ObjectId

/**
 * Extends the Realm-provided RealmRecyclerViewAdapter to provide data
 * for a RecyclerView to display Realm objects on screen to a user.
 */
internal class ItemAdapter(data: OrderedRealmCollection<Item>, val user: io.realm.mongodb.User, private val partition: String) : RealmRecyclerViewAdapter<Item, ItemAdapter.ItemViewHolder?>(data, true) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        val itemView: View = LayoutInflater.from(parent.context).inflate(R.layout.item_view, parent, false)
        return ItemViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        val obj: Item? = getItem(position)
        holder.id = obj?._id
        holder.name.text = obj?.name

        holder.itemView.setOnClickListener {
            val popup = PopupMenu(holder.itemView.context, holder.menu)
            val menu = popup.menu
            val deleteCode = -1
            menu.add(0, deleteCode, Menu.NONE, "Delete")
            popup.setOnMenuItemClickListener { menuItem: MenuItem? ->
                when (menuItem!!.itemId) {
                    deleteCode -> {
                        deleteItem(holder.id!!)
                    }
                }
                true
            }
            popup.show()
        }
    }

    /**
     *  Allows the user to delete an item from the realm.
     */
    private fun deleteItem(id: ObjectId) {
        val config = SyncConfiguration.Builder(user, partition).build()

        val realm: Realm = Realm.getInstance(config)
        realm.executeTransactionAsync {
            val item = it.where<Item>().equalTo("_id", id).findFirst()
            item?.deleteFromRealm()
        }
        realm.close()
    }

    internal inner class ItemViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        var name: TextView = view.findViewById(R.id.name)
        var id: ObjectId? = null
        var menu: TextView = view.findViewById(R.id.menu)
    }

}
