const TodoSchema = {
  name: 'Todo',
  properties: {
    _id: 'objectId',
    isComplete: { type: 'bool', default: false },
    summary: 'string',
  },
  primaryKey: '_id',
};

export default TodoSchema;
