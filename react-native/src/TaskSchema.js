const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'objectId',
    isComplete: {type: 'bool', default: false},
    summary: 'string',
  },
  primaryKey: '_id',
};

export default TaskSchema;
