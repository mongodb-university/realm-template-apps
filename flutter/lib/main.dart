import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/init_realm.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'realm/app_services.dart';
import './screens/homepage.dart';
import './screens/log_in.dart';

const _APP_ID = 'todo-sync-msgyz';

void main() => runApp(ChangeNotifierProvider<AppServices>(
    create: (_) => AppServices(_APP_ID), child: const App()));

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final currentUser =
        Provider.of<AppServices>(context, listen: false).currentUser;
    return MaterialApp(
      title: 'Realm Flutter Todo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: currentUser != null ? '/' : '/login',
      routes: {
        '/': (context) => homepage(context),
        '/login': (context) => LogIn()
      },
    );
  }
}

Widget homepage(BuildContext context) {
  final currentUser = Provider.of<AppServices>(context).currentUser;

  if (currentUser != null) {
    return Provider<Realm>(
      create: (_) => initRealm(currentUser),
      dispose: (_, realm) => realm.close(),
      builder: (context, child) {
        return const HomePage();
      },
    );
  } else {
    return Text('oh no');
  }
}
