#include <string>

#include "item.hpp"

class ItemManager {
private:
    std::string allItemSubscriptionName;
    std::string myItemSubscriptionName;
    std::unique_ptr<realm::db> databasePtr;
    //std::shared_ptr<realm::results<realm::Item>> itemList;

public:
    //std::shared_ptr<realm::results<realm::Item>> itemList;
//    int itemCount;
//    int completedItemCount;
//    int incompleteItemCount;
//    int myItemCount;

    void init(realm::user* mUser, int subscriptionSelection, int offlineModeSelection);
    void addNew(std::string summary, bool isComplete, std::string userId);
    void remove(realm::managed<realm::Item> itemToDelete);
    void markComplete(realm::managed<realm::Item> itemToMarkComplete);
    realm::results<realm::Item> getItemList();
};
