import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:provider/provider.dart';
import 'modify_item.dart';

class ItemCard extends StatelessWidget {
  final Item item;

  const ItemCard(this.item, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final realmServices = Provider.of<RealmServices>(context);
    return Card(
      child: ListTile(
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
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(Icons.edit),
              tooltip: "Edit item",
              onPressed: () {
                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  builder: (_) => Wrap(children: [ModifyItemForm(item)]),
                );
              },
            ),
            IconButton(
              icon: const Icon(Icons.delete),
              tooltip: "Delete item",
              onPressed: () => realmServices.deleteItem(item),
            ),
          ],
        ),
      ),
    );
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
