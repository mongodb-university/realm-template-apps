// :snippet-start: todo-item
// ... imports
// :remove-start:
import 'package:flutter/material.dart';
import 'package:flutter_todo/components/modify_item.dart';
import 'package:flutter_todo/components/widgets.dart';
import 'package:flutter_todo/theme.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:flutter_todo/realm/realm_services.dart';
// :remove-end:

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
            // ... leading property and child content
            // :remove-start:
            leading: Checkbox(
              value: item.isComplete,
              onChanged: (bool? value) async {
                if (isMine) {
                  await realmServices.updateItem(item,
                      isComplete: value ?? false);
                } else {
                  errorMessageSnackBar(context, "Change not allowed!",
                          "You are not allowed to change the status of \n tasks that don't belog to you.")
                      .show(context);
                }
              },
            ),
            // :remove-end:
            // :emphasize-start:
            title: Row(
              children: [
                Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: _PriorityIndicator(item.priority),
                ),
                SizedBox(width: 175, child: Text(item.summary)),
              ],
            ),
            // :emphasize-end:
            // ... subtitle, trailing, and shape properties with child content
            // :remove-start:
            subtitle: Text(
              isMine ? '(mine) ' : '',
              style: boldTextStyle(),
            ),
            trailing: SizedBox(
              width: 25,
              child: PopupMenuButton<MenuOption>(
                onSelected: (menuItem) =>
                    handleMenuClick(context, menuItem, item, realmServices),
                itemBuilder: (context) => [
                  const PopupMenuItem<MenuOption>(
                    value: MenuOption.edit,
                    child: ListTile(
                        leading: Icon(Icons.edit), title: Text("Edit item")),
                  ),
                  const PopupMenuItem<MenuOption>(
                    value: MenuOption.delete,
                    child: ListTile(
                        leading: Icon(Icons.delete),
                        title: Text("Delete item")),
                  ),
                ],
              ),
            ),
            shape: const Border(bottom: BorderSide()),
            // :remove-end:
          )
        : Container();
  }

  // ... handleMenuClick() function
  // :remove-start:
  void handleMenuClick(BuildContext context, MenuOption menuItem, Item item,
      RealmServices realmServices) {
    bool isMine = (item.ownerId == realmServices.currentUser?.id);
    switch (menuItem) {
      case MenuOption.edit:
        if (isMine) {
          showModalBottomSheet(
            context: context,
            isScrollControlled: true,
            builder: (_) => Wrap(children: [ModifyItemForm(item)]),
          );
        } else {
          errorMessageSnackBar(context, "Edit not allowed!",
                  "You are not allowed to edit tasks \nthat don't belog to you.")
              .show(context);
        }
        break;
      case MenuOption.delete:
        if (isMine) {
          realmServices.deleteItem(item);
        } else {
          errorMessageSnackBar(context, "Delete not allowed!",
                  "You are not allowed to delete tasks \n that don't belog to you.")
              .show(context);
        }
        break;
    }
  }
  // :remove-end:
}

// :emphasize-start:
class _PriorityIndicator extends StatelessWidget {
  final int? priority;
  const _PriorityIndicator(this.priority, {Key? key}) : super(key: key);
  Widget getIconForPriority(int? priority) {
    if (priority == PriorityLevel.low) {
      return const Icon(Icons.keyboard_arrow_down, color: Colors.blue);
    } else if (priority == PriorityLevel.medium) {
      return const Icon(Icons.circle, color: Colors.grey);
    } else if (priority == PriorityLevel.high) {
      return const Icon(Icons.keyboard_arrow_up, color: Colors.orange);
    } else if (priority == PriorityLevel.severe) {
      return const Icon(
        Icons.block,
        color: Colors.red,
      );
    } else {
      return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    return getIconForPriority(priority);
  }
}
// :emphasize-end:
// :snippet-end:
