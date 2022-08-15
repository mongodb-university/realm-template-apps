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
      // :state-start: partition-based-sync
      _partition: 'string',
      // :state-end:
      // :state-uncomment-start: flexible-sync
      // owner_id: 'string',
      // :state-uncomment-end:flexible-sync
    },
    primaryKey: '_id',
  };
}
