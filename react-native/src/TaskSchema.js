import {BSON} from 'realm';

const TaskSchema = {
  name: 'Task',
  properties: {
    _id: {type: 'objectId', default: new BSON.ObjectID()},
    isComplete: {type: 'bool', default: false},
    summary: 'string',
  },
  primaryKey: '_id',
};

export default TaskSchema;
