#include <string>

#include "item.hpp"

class ItemManager {
private:
    std::string allItemSubscriptionName;
    std::string myItemSubscriptionName;
    realm::user mUser;

public:
    realm::results<realm::Item> items;
    int itemCount;
    int completedItemCount;
    int incompleteItemCount;
    int myItemCount;

    void init(realm::user mUser, int subscriptionSelection, int offlineModeSelection);
    void addNew(std::string summary, bool isComplete, std::string userId);
    void remove(realm::managed<realm::Item> itemToDelete);
    void markComplete(realm::managed<realm::Item> itemToMarkComplete);
};
