// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/realm_services.dart';

class TodoAppBar extends StatelessWidget with PreferredSizeWidget {
  TodoAppBar({Key? key}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final realmServices = Provider.of<RealmServices>(context);
    return AppBar(
      title: const Text('Realm Flutter To-Do'),
      automaticallyImplyLeading: false,
      actions: <Widget>[
        IconButton(
          icon: Icon(realmServices.offlineModeOn ? Icons.wifi_off_rounded : Icons.wifi_rounded),
          tooltip: 'Offline mode',
          onPressed: () async => await realmServices.sessionSwitch(),
        ),
        IconButton(
          icon: const Icon(Icons.logout),
          tooltip: 'Log out',
          onPressed: () async => await logOut(context, realmServices),
        ),
      ],
    );
  }

  Future<void> logOut(BuildContext context, RealmServices realmServices) async {
    await realmServices.logOutUser();
    Navigator.pushNamed(context, '/login');
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
