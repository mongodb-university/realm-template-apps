#pragma once

/** Use subscriptions to sync only the user's items, or sync all items. Rules in the App Services App
 *  enforce that the user can only write their own item, but can read all items. */
enum SubscriptionSelection: int {
  myItems,
  allItems
};