import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

export function TodoItem({ todo, todoActions, forceUpdateTodos }) {
  const onToggleTodo = () => {
    todoActions.toggleTodo(todo);
    forceUpdateTodos();
  };

  const onDeleteTodo = () => {
    todoActions.deleteTodo(todo);
    forceUpdateTodos();
  };
  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          edge="start"
          color="primary"
          checked={todo.isComplete}
          onClick={onToggleTodo}
        />
      </ListItemIcon>
      <ListItemText>{todo.summary}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton edge="end" size="small" onClick={onDeleteTodo}>
          <ClearIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
