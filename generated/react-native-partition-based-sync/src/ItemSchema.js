import {BSON} from 'realm';

export class Item {
  constructor({
    _id = new BSON.ObjectId(),
    isComplete = false,
  }) {
    this._id = _id;
    this.isComplete = isComplete;
  }

  static schema = {
    name: 'Item',
    properties: {
      _id: 'objectId',
      isComplete: {type: 'bool', default: false},
      summary: 'string',
      _partition: 'string',
    },
    primaryKey: '_id',
  };
}
