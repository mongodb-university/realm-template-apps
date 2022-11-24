import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:provider/provider.dart';

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
    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        color: Colors.grey.shade100,
        padding: const EdgeInsets.only(
          top: 25,
          bottom: 25,
          left: 30,
          right: 30,
        ),
        child: Center(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Text(
                  'Update Your Item',
                  style: myTextTheme.headline6,
                ),
                TextFormField(
                  controller: summaryController,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter some text';
                    }
                    return null;
                  },
                ),
                StatefulBuilder(builder: (BuildContext context, StateSetter setState) {
                  isCompleteController.addListener(() => setState(() {}));
                  return Column(
                    children: <Widget>[
                      RadioListTile(
                        title: const Text('Complete'),
                        value: true,
                        onChanged: (value) => isCompleteController.value = (value as bool?) ?? false,
                        groupValue: isCompleteController.value,
                      ),
                      RadioListTile(
                        title: const Text('Incomplete'),
                        value: false,
                        onChanged: (value) => isCompleteController.value = (value as bool?) ?? false,
                        groupValue: isCompleteController.value,
                      ),
                    ],
                  );
                }),
                Padding(
                  padding: const EdgeInsets.only(top: 15),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                        child: ElevatedButton(
                          style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Colors.grey)),
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Cancel'),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                        child: ElevatedButton(
                          style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Colors.red)),
                          onPressed: () => delete(realmServices, item, context),
                          child: const Text('Delete'),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                        child: ElevatedButton(
                          child: const Text('Update'),
                          onPressed: () async {
                            await update(context, realmServices, item, summaryController.text, isCompleteController.value);
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
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
