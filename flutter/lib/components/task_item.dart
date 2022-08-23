import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'modify_task.dart';
import 'package:flutter_todo/viewmodels/task_viewmodel.dart';

class TaskItem extends StatelessWidget {
  final TaskViewModel viewModel;
  final Animation<double> animation;

  const TaskItem(this.viewModel, this.animation, {Key? key}) : super(key: key);

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
                    showModifyTaskModal(context, viewModel);
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
                title: Text(viewModel.summary),
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
  final TaskViewModel viewModel;
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
