package com.mongodb.app

import android.view.*
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
internal class ItemAdapter(data: OrderedRealmCollection<Item>, private val config: RealmConfiguration) : RealmRecyclerViewAdapter<Item, ItemAdapter.ItemViewHolder?>(data, true) {

    internal inner class ItemViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        var id: ObjectId? = null
        var name: TextView = view.findViewById(R.id.name)
        var menu: TextView = view.findViewById(R.id.popup_menu)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        val itemView: View = LayoutInflater.from(parent.context).inflate(R.layout.item_view, parent, false)
        return ItemViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        val obj: Item? = getItem(position)
        holder.id = obj?._id
        holder.name.text = obj?.name

        /**
         *  Creates a popup menu that allows the user to delete an item from the realm.
         */
        holder.itemView.setOnClickListener {
            val popup = PopupMenu(holder.itemView.context, holder.menu)
            popup.menu.add(0, R.id.action_delete, Menu.NONE, "Delete")
            popup.setOnMenuItemClickListener { menuItem: MenuItem ->
                when (menuItem.itemId) {
                    R.id.action_delete -> {
                        val realm: Realm = Realm.getInstance(config)
                        realm.executeTransactionAsync {
                            val item = it.where<Item>().equalTo("_id", holder.id).findFirst()
                            item?.deleteFromRealm()
                        }
                        realm.close()                    }
                }
                true
            }
            popup.show()
        }
    }
}
