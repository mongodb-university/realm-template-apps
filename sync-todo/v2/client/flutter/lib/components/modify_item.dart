import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:flutter_todo/components/widgets.dart';
// :state-start: tutorial
// TUTORIAL: Import 'select_priority.dart'
// :state-end:

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
  // :state-start: tutorial
  // TUTORIAL: Add `_priority` variable and _setPriority() function
  // :state-end:

  _ModifyItemFormState(this.item);

  @override
  void initState() {
    _summaryController = TextEditingController(text: item.summary);
    _isCompleteController = ValueNotifier<bool>(item.isComplete)
      ..addListener(() => setState(() {}));
    // :state-start: tutorial
    // TUTORIAL: Add `_priority` from widget
    // :state-end:

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
                Text("Update your item", style: myTextTheme.headline6),
                TextFormField(
                  controller: _summaryController,
                  validator: (value) =>
                      (value ?? "").isEmpty ? "Please enter some text" : null,
                ),
                // :state-start: tutorial
                // TUTORIAL: Add `SelectPriority` widget here
                // :state-end:
                StatefulBuilder(
                    builder: (BuildContext context, StateSetter setState) {
                  return Column(
                    children: <Widget>[
                      radioButton("Complete", true, _isCompleteController),
                      radioButton("Incomplete", false, _isCompleteController),
                    ],
                  );
                }),
                Padding(
                  padding: const EdgeInsets.only(top: 15),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      cancelButton(context),
                      deleteButton(context,
                          onPressed: () =>
                              delete(realmServices, item, context)),
                      // :state-start: tutorial
                      // TUTORIAL: Add `_priority` to okButton()
                      // :state-end:
                      okButton(context, "Update",
                          onPressed: () async => await update(
                              context,
                              realmServices,
                              item,
                              _summaryController.text,
                              _isCompleteController.value)),
                    ],
                  ),
                ),
              ],
            )));
  }

  // :state-start: tutorial
  // TUTORIAL: Add `priority` to parameters
  // :state-end:
  Future<void> update(BuildContext context, RealmServices realmServices,
      Item item, String summary, bool isComplete) async {
    if (_formKey.currentState!.validate()) {
      // :state-start: tutorial
      // TUTORIAL: Add `priority` to updateItem() call
      // :state-end:
      await realmServices.updateItem(item,
          summary: summary, isComplete: isComplete);
      Navigator.pop(context);
    }
  }

  void delete(RealmServices realmServices, Item item, BuildContext context) {
    realmServices.deleteItem(item);
    Navigator.pop(context);
  }
}
