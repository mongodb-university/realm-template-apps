import 'package:flutter/material.dart';
import 'package:flutter_todo/components/modify_item.dart';
import 'package:flutter_todo/components/widgets.dart';
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
    bool isMine = (item.ownerId == realmServices.currentUser?.id);
    return item.isValid
        ? ListTile(
            leading: Checkbox(
              checkColor: Colors.white,
              fillColor: MaterialStateProperty.resolveWith(getColor),
              value: item.isComplete,
              onChanged: (bool? value) async {
                await realmServices.updateItem(item, isComplete: value ?? false);
              },
            ),
            title: Text(item.summary),
            subtitle: Row(
              children: [
                Text(isMine ? '(mine) ' : '', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black)),
                Text(item.isComplete ? 'Completed' : 'Incomplete'),
              ],
            ),
            trailing: SizedBox(
              width: 25,
              child: PopupMenuButton<MenuOption>(
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
            ),
            shape: const Border(bottom: BorderSide()),
          )
        : Container();
  }

  void handleMenuClick(BuildContext context, MenuOption menuItem, Item item, RealmServices realmServices) {
    switch (menuItem) {
      case MenuOption.edit:
        if (item.ownerId == realmServices.currentUser?.id) {
          showModalBottomSheet(
            context: context,
            isScrollControlled: true,
            builder: (_) => Wrap(children: [ModifyItemForm(item)]),
          );
        } else {
          showError(context, '''You are not allowed to edit tasks
            that don't belog to you.''');
        }
        break;
      case MenuOption.delete:
        if (item.ownerId == realmServices.currentUser?.id) {
          realmServices.deleteItem(item);
        } else {
          showError(context, '''You are not allowed to delete tasks
            that don't belog to you.''');
        }

        break;
    }
  }

  void showError(BuildContext context, String error, {int durationInSeconds = 15}) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      errorMessageWidget(error),
    );
    Future.delayed(Duration(seconds: durationInSeconds)).then((value) {
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
    });
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
