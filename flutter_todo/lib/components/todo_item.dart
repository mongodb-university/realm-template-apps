import 'package:flutter/material.dart';
import 'package:flutter_todo/components/modify_item.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:flutter_todo/realm/realm_services.dart';

enum MenuOption { edit, delete }

class TodoItem extends StatelessWidget {
  final Item item;

  const TodoItem(this.item, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final realmServices = Provider.of<RealmServices>(context);
    return ListTile(
      leading: Checkbox(
        checkColor: Colors.white,
        fillColor: MaterialStateProperty.resolveWith(getColor),
        value: item.isComplete,
        onChanged: (bool? value) async {
          await realmServices.updateItem(item, isComplete: value ?? false);
        },
      ),
      title: Expanded(child: Text(item.summary)),
      subtitle: Text(item.isComplete ? 'Completed' : 'Incomplete'),
      trailing: PopupMenuButton<MenuOption>(
        onSelected: (menuItem) => handleMenuClick(context, menuItem, item, realmServices),
        itemBuilder: (context) => [
          const PopupMenuItem<MenuOption>(
            value: MenuOption.edit,
            child: ListTile(leading: Icon(Icons.edit), title: Text("Edit item")),
          ),
          const PopupMenuItem<MenuOption>(
            value: MenuOption.delete,
            child: ListTile(leading: Icon(Icons.delete), title: Text("Delete item")),
          ),
        ],
      ),
    );
  }

  void handleMenuClick(BuildContext context, MenuOption menuItem, Item item, RealmServices realmServices) {
    switch (menuItem) {
      case MenuOption.edit:
        showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          builder: (_) => Wrap(children: [ModifyItemForm(item)]),
        );
        break;
      case MenuOption.delete:
        realmServices.deleteItem(item);
        break;
    }
  }

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
}
