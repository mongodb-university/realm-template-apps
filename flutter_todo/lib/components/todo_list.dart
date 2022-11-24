import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:flutter_todo/components/todo_item.dart';

class TodoList extends StatefulWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  @override
  Widget build(BuildContext context) {
    return Stack(children: [
      Padding(
        padding: const EdgeInsets.all(16.0),
        child: Consumer<RealmServices>(builder: (context, realmServices, child) {
          final results = realmServices.realm.all<Item>();
          return Column(
            children: [
              Row(
                mainAxisSize: MainAxisSize.max,
                children: [
                  const Expanded(child: Text("Show completed tasks only", textAlign: TextAlign.right)),
                  Switch(
                    value: realmServices.filterOn,
                    onChanged: (value) => realmServices.filterSwitch(value),
                  ),
                ],
              ),
              Expanded(
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: results.length,
                  itemBuilder: (context, index) => TodoItem(results[index]),
                ),
              ),
            ],
          );
        }),
      ),
      Consumer<RealmServices>(builder: (context, realmServices, child) {
        return realmServices.isWaiting
            ? Container(
                color: Colors.black.withOpacity(0.2),
                child: const Center(child: CircularProgressIndicator()),
              )
            : Container();
      })
    ]);
  }
}
