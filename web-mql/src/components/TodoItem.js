import React from "react";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

export function TodoItem({ todo, todoActions }) {
  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
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
