import {BSON} from 'realm';

export class Item {
  constructor({
    _id = new BSON.ObjectId(),
    isComplete = false,
    // :state-uncomment-start: flexible-sync
    // owner_id,
    // :state-uncomment-end:flexible-sync
  }) {
    this._id = _id;
    this.isComplete = isComplete;
    // :state-uncomment-start: flexible-sync
    // this.owner_id: 'string',
    // :state-uncomment-end:flexible-sync
  }

  static schema = {
    name: 'Item',
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
