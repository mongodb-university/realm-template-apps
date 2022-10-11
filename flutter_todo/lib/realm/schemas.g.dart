// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'schemas.dart';

// **************************************************************************
// RealmObjectGenerator
// **************************************************************************

class Item extends _Item with RealmEntity, RealmObject {
  static var _defaultsSet = false;

  Item(
    ObjectId id,
    String summary,
    String ownerId, {
    bool isComplete = false,
  }) {
    if (!_defaultsSet) {
      _defaultsSet = RealmObject.setDefaults<Item>({
        'isComplete': false,
      });
    }
    RealmObject.set(this, '_id', id);
    RealmObject.set(this, 'isComplete', isComplete);
    RealmObject.set(this, 'summary', summary);
    RealmObject.set(this, 'owner_id', ownerId);
  }

  Item._();

  @override
  ObjectId get id => RealmObject.get<ObjectId>(this, '_id') as ObjectId;
  @override
  set id(ObjectId value) => throw RealmUnsupportedSetError();

  @override
  bool get isComplete => RealmObject.get<bool>(this, 'isComplete') as bool;
  @override
  set isComplete(bool value) => RealmObject.set(this, 'isComplete', value);

  @override
  String get summary => RealmObject.get<String>(this, 'summary') as String;
  @override
  set summary(String value) => RealmObject.set(this, 'summary', value);

  @override
  String get ownerId => RealmObject.get<String>(this, 'owner_id') as String;
  @override
  set ownerId(String value) => RealmObject.set(this, 'owner_id', value);

  @override
  Stream<RealmObjectChanges<Item>> get changes =>
      RealmObject.getChanges<Item>(this);

  static SchemaObject get schema => _schema ??= _initSchema();
  static SchemaObject? _schema;
  static SchemaObject _initSchema() {
    RealmObject.registerFactory(Item._);
    return const SchemaObject(Item, 'Item', [
      SchemaProperty('_id', RealmPropertyType.objectid,
          mapTo: '_id', primaryKey: true),
      SchemaProperty('isComplete', RealmPropertyType.bool),
      SchemaProperty('summary', RealmPropertyType.string),
      SchemaProperty('owner_id', RealmPropertyType.string, mapTo: 'owner_id'),
    ]);
  }
}
