import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'modify_item.dart';
import 'package:flutter_todo/viewmodels/item_viewmodel.dart';

class ItemCard extends StatelessWidget {
  final ItemViewModel viewModel;
  final Animation<double> animation;

  const ItemCard(this.viewModel, this.animation, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final realm = Provider.of<Realm>(context);
    void deleteItem() {
      viewModel.delete();
    }

    return FadeTransition(
      key: key ?? ObjectKey(viewModel),
      opacity: animation,
      child: SizeTransition(
        sizeFactor: animation,
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          child: Slidable(
            endActionPane: ActionPane(
              motion: const ScrollMotion(),
              children: [
                SlidableAction(
                  onPressed: (BuildContext context) {
                    showModifyItemModal(context, viewModel);
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
              ],
            ),
            child: Card(
              child: ListTile(
                title: Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: _PriorityIndicator(viewModel.priority),
                    ),
                    SizedBox(width: 175, child: Text(viewModel.summary)),
                  ],
                ),
                subtitle:
                    Text(viewModel.isComplete ? 'Completed' : 'Incomplete'),
                leading: _CompleteCheckbox(viewModel),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CompleteCheckbox extends StatelessWidget {
  final ItemViewModel viewModel;
  const _CompleteCheckbox(this.viewModel, {Key? key}) : super(key: key);
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
      value: viewModel.isComplete,
      onChanged: (bool? value) {
        viewModel.update(isComplete: value ?? false);
      },
    );
  }
}

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
