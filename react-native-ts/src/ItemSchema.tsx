import Realm from 'realm';

export class Item extends Realm.Object<Item> {
  _id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
  isComplete: boolean = false;
  summary!: string;
  owner_id!: string;

  static primaryKey = '_id';
}
