import React from "react";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export function TodoItem({ todo, todoActions }) {
  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          data-testid="todo-checkbox"
          edge="start"
          color="primary"
          checked={todo.isComplete}
          onClick={() => {
            todoActions.toggleTodo(todo);
          }}
        />
      </ListItemIcon>
      <ListItemText>{todo.summary}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          data-testid="todo-delete-button"
          edge="end"
          size="small"
          onClick={() => {
            todoActions.deleteTodo(todo);
          }}
        >
          <ClearIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
