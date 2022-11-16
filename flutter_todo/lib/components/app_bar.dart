// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/app_services.dart';
import 'package:flutter_todo/realm/state_services.dart';

class TodoAppBar extends StatelessWidget with PreferredSizeWidget {

  TodoAppBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final app = Provider.of<AppServices>(context);
    final state = Provider.of<StateServices>(context);


    Future<void> logOut() async {
      await app.logOutUser();
      Navigator.pushNamed(context, '/login');
    }

    return AppBar(
        title: const Text('Realm Flutter Todo'),
        automaticallyImplyLeading: false,
        actions: app.currentUser != null
            ? <Widget>[
                IconButton(
                  icon: Icon(state.filterOn ? Icons.filter_list_rounded : Icons.filter_list_off_rounded),
                  tooltip: 'Filter completed',
                  onPressed: () => state.filterSwitch(),
                ),
                IconButton(
                  icon: Icon(state.airplaneModeOn ? Icons.airplanemode_active : Icons.airplanemode_inactive),
                  tooltip: 'Airplane mode',
                  onPressed: () => state.sessionSwitch(),
                ),
                IconButton(
                  icon: const Icon(Icons.logout),
                  tooltip: 'Log Out Icon',
                  onPressed: logOut,
                ),
              ]
            : null);
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
