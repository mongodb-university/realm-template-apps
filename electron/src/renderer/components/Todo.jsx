import {
  Container,
  Button,
  Typography,
  List,
  LinearProgress,
  Card
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useTodos from '../hooks/useTodos';
import { TodoItem } from './TodoItem';
import useDraftTodos from '../hooks/useDraftTodos';
import { DraftTodoItem } from './DraftTodoItem';
import { useShowLoader, useForceUpdate } from '../hooks/useUtils';
import { MoreInfo } from './MoreInfo';

const TodoItemsPage = () => {
  const { loading, todos, ...todoActions } = useTodos();
  const { draftTodos, ...draftTodoActions } = useDraftTodos();
  // TODO: examine if this is best practice for rerendering updated todos
  // this is super inefficient as it stands now, causing all todos to rerender if
  // one is updated. not sure what the best approach should be here.
  const forceUpdateTodos = useForceUpdate();
  const showLoader = useShowLoader(loading, 200);

  // Delete later for non stubbed data todos
  if(todos.length < 1){
    todos.push({
      isComplete: false,
      summary: "test summary"
    })
    todos.push({
      isComplete: true,
      summary: "test summary 2"
    })
  }

  return (
    <>
    <Container className="main-container" maxWidth="sm">
      {loading ? (
        showLoader ? (
          <LinearProgress />
        ) : null
      ) : (
        <div className="todo-items-container">
          <Typography component="p" variant="h5">
            {`You have ${todos.length} To-Do Item${
              todos.length === 1 ? '' : 's'
            }`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => draftTodoActions.createDraftTodo()}
          >
            Add To-Do
          </Button>
          <List style={{ width: '100%' }}>
            {todos.map((todo) => (
              <TodoItem
                key={String(todo._id)}
                todo={todo}
                todoActions={todoActions}
                forceUpdateTodos={forceUpdateTodos}
              />
            ))}
            {draftTodos.map((draft) => (
              <DraftTodoItem
                key={String(draft._id)}
                todo={draft}
                todoActions={todoActions}
                draftTodoActions={draftTodoActions}
              />
            ))}
          </List>
        </div>
      )}
    </Container>
    <div className="custom-sync-message-card">
      <p className="custom-sync-message">
        Log in with the same account on another device or simulator to see your list sync in real-time
      </p>
    </div>

    </>
  );
};

export default TodoItemsPage;
