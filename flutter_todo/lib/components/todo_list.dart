import 'package:flutter/material.dart';
import 'package:flutter_todo/components/item_card.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';

class TodoList extends StatefulWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  Widget filterSwitchWidget(RealmServices realmServices) {
    return SizedBox(
        height: 50,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Spacer(),
            const Text("Show completed tasks only", textAlign: TextAlign.right),
            Switch(
              value: realmServices.filterOn,
              onChanged: (value) async {
                await realmServices.filterSwitch();
                setState(() => realmServices.filterOn = value);
              },
            ),
          ],
        ));
  }

  Widget todoListWidget(RealmServices realmServices) {
    final results = realmServices.realm.all<Item>();
    return Expanded(
      child: ListView.builder(
        shrinkWrap: true,
        itemCount: results.length,
        itemBuilder: (context, index) => ItemCard(results[index]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final realmServices = Provider.of<RealmServices>(context);
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(children: [
        filterSwitchWidget(realmServices),
        todoListWidget(realmServices),
      ]),
    );
  }
}
