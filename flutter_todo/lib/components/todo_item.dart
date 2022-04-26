import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'modify_todo.dart';

class TodoItem extends StatelessWidget {
  final Todo todo;

  const TodoItem(this.todo, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final realm = Provider.of<Realm>(context);
    void deleteItem() {
      realm.write(() {
        realm.delete(todo);
      });
    }

    return Slidable(
      key: const ValueKey(0),
      endActionPane: ActionPane(motion: ScrollMotion(), children: [
        SlidableAction(
          onPressed: (BuildContext context) {
            showModifyTodoModal(context, todo);
          },
          flex: 2,
          backgroundColor: Color(Colors.blue[500].hashCode),
          foregroundColor: Colors.white,
          icon: Icons.edit,
          label: 'Change',
        ),
        SlidableAction(
          onPressed: (BuildContext context) {
            deleteItem();
          },
          flex: 2,
          backgroundColor: Color(Colors.red[600].hashCode),
          foregroundColor: Colors.white,
          icon: Icons.delete_forever,
          label: 'Delete',
        )
      ]),
      // actions: []
      child: Card(
        child: ListTile(
            title: Text(todo.summary),
            subtitle: todo.isComplete
                ? const Text('Completed')
                : const Text('Incomplete'),
            leading: _CompleteCheckbox(todo)),
      ),
    );
  }
}

class _CompleteCheckbox extends StatelessWidget {
  final Todo todo;
  const _CompleteCheckbox(this.todo, {Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    final realm = Provider.of<Realm>(context);

    Color getColor(Set<MaterialState> states) {
      const Set<MaterialState> interactiveStates = <MaterialState>{
        MaterialState.pressed,
        MaterialState.hovered,
        MaterialState.focused,
      };
      if (states.any(interactiveStates.contains)) {
        return Colors.blue;
      }
      return Colors.blue;
    }

    return Checkbox(
      checkColor: Colors.white,
      fillColor: MaterialStateProperty.resolveWith(getColor),
      value: todo.isComplete,
      onChanged: (bool? value) {
        realm.write(() {
          todo.isComplete = value ?? false;
        });
      },
    );
  }
}
