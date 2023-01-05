// :snippet-start: modify-item
// ... other imports
// :remove-start:
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:flutter_todo/components/widgets.dart';
// :remove-end:
// :emphasize-start:
import 'package:flutter_todo/components/select_priority.dart';
// :emphasize-end:

class ModifyItemForm extends StatefulWidget {
  final Item item;
  const ModifyItemForm(this.item, {Key? key}) : super(key: key);

  @override
  _ModifyItemFormState createState() => _ModifyItemFormState(item);
}

class _ModifyItemFormState extends State<ModifyItemForm> {
  final _formKey = GlobalKey<FormState>();
  final Item item;
  late TextEditingController _summaryController;
  late ValueNotifier<bool> _isCompleteController;

// :emphasize-start:
  late int? _priority;
  void _setPriority(int priority) {
    setState(() {
      _priority = priority;
    });
  }
  // :emphasize-end:

  _ModifyItemFormState(this.item);

  @override
  void initState() {
    _summaryController = TextEditingController(text: item.summary);
    _isCompleteController = ValueNotifier<bool>(item.isComplete)
      ..addListener(() => setState(() {}));
    // :emphasize-start:
    _priority = widget.item.priority;
    // :emphasize-end:
    super.initState();
  }

  @override
  void dispose() {
    _summaryController.dispose();
    _isCompleteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    TextTheme myTextTheme = Theme.of(context).textTheme;
    final realmServices = Provider.of<RealmServices>(context, listen: false);
    return formLayout(
        context,
        Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                // ... Text and TextFormField widgets
                // :remove-start:
                Text("Update your item", style: myTextTheme.headline6),
                TextFormField(
                  controller: _summaryController,
                  validator: (value) =>
                      (value ?? "").isEmpty ? "Please enter some text" : null,
                ),
                // :remove-end:
                // :emphasize-start:
                SelectPriority(_priority ?? PriorityLevel.medium, _setPriority),
                // :emphasize-end:
                // ... StatefulBuilder widget
                // :remove-start:
                StatefulBuilder(
                    builder: (BuildContext context, StateSetter setState) {
                  return Column(
                    children: <Widget>[
                      radioButton("Complete", true, _isCompleteController),
                      radioButton("Incomplete", false, _isCompleteController),
                    ],
                  );
                }),
                // :remove-end:
                Padding(
                  padding: const EdgeInsets.only(top: 15),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      cancelButton(context),
                      deleteButton(context,
                          onPressed: () =>
                              delete(realmServices, item, context)),
                      // :emphasize-start:
                      okButton(context, "Update",
                          onPressed: () async => await update(
                              context,
                              realmServices,
                              item,
                              _summaryController.text,
                              _isCompleteController.value,
                              _priority)),
                      // :emphasize-end:
                    ],
                  ),
                ),
              ],
            )));
  }

  // :emphasize-start:
  Future<void> update(BuildContext context, RealmServices realmServices,
      Item item, String summary, bool isComplete, int? priority) async {
    // :emphasize-end:
    if (_formKey.currentState!.validate()) {
      // :emphasize-start:
      await realmServices.updateItem(item,
          summary: summary, isComplete: isComplete, priority: priority);
      // :emphasize-end:
      Navigator.pop(context);
    }
  }

  void delete(RealmServices realmServices, Item item, BuildContext context) {
    realmServices.deleteItem(item);
    Navigator.pop(context);
  }
}
//:snippet-end:
