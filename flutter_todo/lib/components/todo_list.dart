import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'item_card.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:flutter_todo/viewmodels/item_viewmodel.dart';

class TodoList extends StatefulWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  final _itemViewModels = <ItemViewModel>[];
  final _myListKey = GlobalKey<AnimatedListState>();

  @override
  Widget build(BuildContext context) {
    final realmServices = Provider.of<RealmServices>(context);
    return StreamBuilder<RealmResultsChanges<Item>>(
        stream: realmServices.realm.all<Item>().changes,
        builder: (context, snapshot) {
          final data = snapshot.data;
          if (data == null) {
            // While we wait for data to load..
            return Container(
              padding: const EdgeInsets.only(top: 25),
              child: const Center(child: Text("No Items yet!")),
            );
          }

          final items = data.results;

          // Handle deletions. These are handles first, as indexes refer to the old collection
          final reversedDeletedIndexes = List.from(data.deleted.reversed);
          for (final deletionIndex in reversedDeletedIndexes) {
            final toDie = _itemViewModels.removeAt(deletionIndex); // update view model collection
            _myListKey.currentState?.removeItem(deletionIndex, (context, animation) {
              return ItemCard(toDie, animation);
            });
          }

          // Handle inserts
          for (final insertionIndex in data.inserted) {
            _itemViewModels.insert(insertionIndex, ItemViewModel(realmServices.realm, items[insertionIndex]));
            _myListKey.currentState?.insertItem(insertionIndex);
          }

          // Handle modifications
          for (final modifiedIndex in data.modified) {
            _itemViewModels[modifiedIndex] = ItemViewModel(realmServices.realm, items[modifiedIndex]);
          }

          // Handle initialization (or any mismatch really, but that shouldn't happen)
          if (items.length != _itemViewModels.length) {
            var count = _itemViewModels.length - 1;
            for (var i = count; i >= 0; i--) {
              _myListKey.currentState?.removeItem(i, (context, animation) {
                return ItemCard(_itemViewModels.removeAt(i), animation);
              });
            }
            for (var i = 0; i < items.length; i++) {
              _itemViewModels.insert(i, ItemViewModel(realmServices.realm, items[i]));
              _myListKey.currentState?.insertItem(i);
            }
            _itemViewModels.length = items.length;
          }

          return AnimatedList(
              key: _myListKey,
              initialItemCount: items.length,
              itemBuilder: (context, index, animation) {
                return ItemCard(_itemViewModels[index], animation);
              });
        });
  }
}
