// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'schemas.dart';

// **************************************************************************
// RealmObjectGenerator
// **************************************************************************

class Todo extends _Todo with RealmEntity, RealmObject {
  static var _defaultsSet = false;

  Todo(
    String id,
    String summary, {
    bool isComplete = false,
  }) {
    if (!_defaultsSet) {
      _defaultsSet = RealmObject.setDefaults<Todo>({
        'isComplete': false,
      });
    }
    RealmObject.set(this, 'id', id);
    RealmObject.set(this, 'isComplete', isComplete);
    RealmObject.set(this, 'summary', summary);
  }

  Todo._();

  @override
  String get id => RealmObject.get<String>(this, 'id') as String;
  @override
  set id(String value) => throw RealmUnsupportedSetError();

  @override
  bool get isComplete => RealmObject.get<bool>(this, 'isComplete') as bool;
  @override
  set isComplete(bool value) => RealmObject.set(this, 'isComplete', value);

  @override
  String get summary => RealmObject.get<String>(this, 'summary') as String;
  @override
  set summary(String value) => RealmObject.set(this, 'summary', value);

  @override
  Stream<RealmObjectChanges<Todo>> get changes =>
      RealmObject.getChanges<Todo>(this);

  static SchemaObject get schema => _schema ??= _initSchema();
  static SchemaObject? _schema;
  static SchemaObject _initSchema() {
    RealmObject.registerFactory(Todo._);
    return const SchemaObject(Todo, 'Todo', [
      SchemaProperty('id', RealmPropertyType.string, primaryKey: true),
      SchemaProperty('isComplete', RealmPropertyType.bool),
      SchemaProperty('summary', RealmPropertyType.string),
    ]);
  }
}
