import 'package:realm/realm.dart';
import 'package:flutter_todo/realm/schemas.dart';

class ItemViewModel {
  final ObjectId id;
  String summary;
  bool isComplete;
  final String ownerId;
  late Item item;
  final Realm realm;

  // If you're following the tutorial, add `this.priority` to `ItemViewModel._()`
  ItemViewModel._(this.realm, this.item, this.id, this.summary, this.ownerId,
      this.isComplete);
  // If you're following the tutorial, add `item.priority ?? PriorityLevel.low`
  // to `this._()`
  ItemViewModel(Realm realm, Item item)
      : this._(
            realm, item, item.id, item.summary, item.ownerId, item.isComplete);

  static ItemViewModel create(Realm realm, Item item) {
    final itemInRealm = realm.write<Item>(() => realm.add<Item>(item));
    return ItemViewModel(realm, item);
  }

  void delete() {
    realm.write(() => realm.delete(item));
  }

  // If you're following the tutorial, add `int? priority` to the named parameters
  // in `update()`
  void update({String? summary, bool? isComplete}) {
    realm.write(() {
      if (summary != null) {
        summary = summary;
        item.summary = summary as String;
      }
      if (isComplete != null) {
        isComplete = isComplete;
        item.isComplete = isComplete as bool;
      }
      // If you're following the tutorial, add another if statement setting
      // `priority` if priority is not null.
    });
  }
}

// If you're following the tutorial, add the `abstract class PriorityLevel`
