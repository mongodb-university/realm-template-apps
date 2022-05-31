import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import './realm/app.dart';
import './screens/homepage.dart';
import './screens/log_in.dart';

void main() => runApp(const App());

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Provider<Realm>(
      create: (_) => Realm(Configuration.local([Todo.schema])),
      dispose: (_, realm) => realm.close(),
      child: MaterialApp(
        title: 'Realm Flutter Todo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        initialRoute: realmApp.currentUser != null ? '/' : '/login',
        routes: {
          '/': (context) => const HomePage(),
          '/login': (context) => LogIn()
        },
      ),
    );
  }
}
