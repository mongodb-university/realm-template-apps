// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/app_services.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/state_services.dart';

class TodoAppBar extends StatelessWidget with PreferredSizeWidget {
  TodoAppBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final app = Provider.of<AppServices>(context);
    final realm = Provider.of<RealmServices?>(context);
    final state = Provider.of<StateServices>(context);

    Future<void> logOut() async {
      await app.logOutUser();
      realm?.dispose();
      Navigator.pushNamed(context, '/login');
    }

    return AppBar(title: const Text('Realm Flutter Todo'), automaticallyImplyLeading: false, actions: <Widget>[
      IconButton(
        icon: Icon(state.filterOn ? Icons.filter_list_rounded : Icons.filter_list_off_rounded),
        tooltip: 'Filter completed',
        onPressed: () async => await state.filterSwitch(realm),
      ),
      IconButton(
        icon: Icon(state.airplaneModeOn ? Icons.airplanemode_active : Icons.airplanemode_inactive),
        tooltip: 'Airplane mode',
        onPressed: () => state.sessionSwitch(realm),
      ),
      IconButton(
        icon: const Icon(Icons.logout),
        tooltip: 'Log Out Icon',
        onPressed: logOut,
      ),
    ]);
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
