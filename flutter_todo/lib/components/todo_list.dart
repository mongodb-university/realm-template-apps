import 'package:flutter/material.dart';
import 'package:flutter_todo/components/todo_item.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:realm/realm.dart';

class TodoList extends StatefulWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  @override
  Widget build(BuildContext context) {
    final allItems = Provider.of<RealmServices>(context, listen: false).realm.all<Item>();
    return Stack(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 15),
                child: Consumer<RealmServices>(builder: (context, realmServices, child) {
                  return Row(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      const Expanded(child: Text("Show only my tasks", textAlign: TextAlign.right)),
                      Switch(
                        value: realmServices.filterOn,
                        onChanged: (value) async => await realmServices.filterSwitch(value),
                      ),
                    ],
                  );
                }),
              ),
              Expanded(
                child: StreamBuilder<RealmResultsChanges<Item>>(
                  stream: allItems.changes,
                  builder: (context, snapshot) {
                    final data = snapshot.data;

                    if (data == null) return waitingIndicator();

                    final results = data.results;
                    return ListView.builder(
                      shrinkWrap: true,
                      itemCount: results.length,
                      itemBuilder: (context, index) => results[index].isValid ? TodoItem(results[index]) : Container(),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
        Consumer<RealmServices>(builder: (context, realmServices, child) {
          return realmServices.isWaiting ? waitingIndicator() : Container();
        }),
      ],
    );
  }

  Container waitingIndicator() {
    return Container(
      color: Colors.black.withOpacity(0.2),
      child: const Center(child: CircularProgressIndicator()),
    );
  }
}
