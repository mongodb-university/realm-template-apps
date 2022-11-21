import {createRealmContext} from '@realm/react';
import {Item} from './ItemSchema';

const realmContext = createRealmContext({
  schema: [Item],
});

export default realmContext;
