import {BSON} from 'realm';

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
