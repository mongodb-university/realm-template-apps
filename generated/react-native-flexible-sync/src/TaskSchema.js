import {BSON} from 'realm';
import {createRealmContext} from '@realm/react';

export class Task {
  constructor({id = new BSON.ObjectId(), isComplete = false}) {
    this.isComplete = isComplete;
    this._id = id;
  }

  static schema = {
    name: 'Task',
    properties: {
      _id: 'objectId',
      isComplete: {type: 'bool', default: false},
      summary: 'string',
      owner_id: 'string',
    },
    primaryKey: '_id',
  };
}

export default createRealmContext({
  schema: [Task.schema],
  deleteRealmIfMigrationNeeded: true,
});
