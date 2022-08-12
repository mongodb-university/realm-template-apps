import {createRealmContext} from '@realm/react';
import { Task } from './TaskSchema';

export default createRealmContext({
  schema: [Task.schema],
});
