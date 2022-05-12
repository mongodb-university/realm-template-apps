import {Realm, createRealmContext} from '@realm/react';

export class Task {
  constructor({
    id = new Realm.BSON.ObjectId(),
    // description,
    isComplete = false,
  }) {
    // this.description = description;
    this.isComplete = isComplete;
    this._id = id;
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Task',
    properties: {
      _id: 'objectId',
      isComplete: {type: 'bool', default: false},
      summary: 'string',
      // :state-uncomment-start: flexible-sync
      // owner_id: 'string',
      // :state-uncomment-end:flexible-sync
    },
    primaryKey: '_id',
  };
}

export default createRealmContext({
  schema: [Task.schema],
  deleteRealmIfMigrationNeeded: true,
});
