package com.mongodb.app

import android.view.*
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
        holder.item = obj
        holder.name.text = obj?.name

        //TODO: how to call this? I'm getting the error:
        // io.realm.exceptions.RealmException: Running transactions on the UI thread has been disabled. It can be enabled by setting 'RealmConfiguration.Builder.allowWritesOnUiThread(true)'.
        // It also doesn't make intuitive sense for deleteItem to be here and addItem to be in the ItemsActivity.
        // Perhaps I should make an interface that handles database transactions and then implement it in both the adapter and the activity?
        holder.itemView.setOnClickListener {
            deleteItem(holder.item?._id!!)
        }
    }

    /**
     *  Allows the user to delete an item from the realm.
     */
    private fun deleteItem(id: ObjectId) {
        val user = realmApp.currentUser()
        val partition = user!!.id
        val config = SyncConfiguration.Builder(user, partition).build()

        val realm: Realm = Realm.getInstance(config)
        // not async because deleteItem should execute on a background thread
        realm.executeTransaction {
            val item = it.where<Item>().equalTo("_id", id).findFirst()
            item?.deleteFromRealm()
        }
        realm.close()
    }

    internal inner class ItemViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        var name: TextView = view.findViewById(R.id.name)
        var item: Item? = null
    }
}
