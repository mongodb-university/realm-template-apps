import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:flutter_todo/components/widgets.dart';



class ModifyItemForm extends StatefulWidget {
  final Item item;
  const ModifyItemForm(this.item, {Key? key}) : super(key: key);

  @override
  _ModifyItemFormState createState() => _ModifyItemFormState();
}

class _ModifyItemFormState extends State<ModifyItemForm> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController summaryController;
  late ValueNotifier<bool> isCompleteController;

  @override
  void dispose() {
    summaryController.dispose();
    isCompleteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    TextTheme myTextTheme = Theme.of(context).textTheme;
    final realmServices = Provider.of<RealmServices>(context, listen: false);
    final item = widget.item;
    summaryController = TextEditingController(text: item.summary);
    isCompleteController = ValueNotifier<bool>(item.isComplete);
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
                  controller: summaryController,
                  validator: (value) => (value ?? "").isEmpty ? "Please enter some text" : null,
                ),
                StatefulBuilder(builder: (BuildContext context, StateSetter setState) {
                  isCompleteController.addListener(() => setState(() {}));
                  return Column(
                    children: <Widget>[
                      radioButton("Complete", true, isCompleteController),
                      radioButton("Incomplete", false, isCompleteController),
                    ],
                  );
                }),
                Padding(
                  padding: const EdgeInsets.only(top: 15),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      cancelButton(context),
                      deleteButton(context, onPressed: () => delete(realmServices, item, context)),
                      okButton(context, "Update",
                          onPressed: () async => await update(context, realmServices, item, summaryController.text, isCompleteController.value)
                      ),
                    ],
                  ),
                ),
              ],
            )));
  } 

  Future<void> update(BuildContext context, RealmServices realmServices, Item item, String summary, bool isComplete) async {
    if (_formKey.currentState!.validate()) {
      await realmServices.updateItem(item, summary: summary, isComplete: isComplete);
      Navigator.pop(context);
    }
  }

  void delete(RealmServices realmServices, Item item, BuildContext context) {
    realmServices.deleteItem(item);
    Navigator.pop(context);
  }
}
