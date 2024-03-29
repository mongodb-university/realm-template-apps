#ifndef ITEM_HPP
#define ITEM_HPP

#include "cpprealm/sdk.hpp"

namespace realm {

struct Item {
  realm::primary_key<realm::object_id> _id{realm::object_id::generate()};
  bool isComplete;
  std::string summary;
  std::string owner_id;
};
REALM_SCHEMA(Item, _id, isComplete, summary, owner_id)

}  // namespace realm

#endif
