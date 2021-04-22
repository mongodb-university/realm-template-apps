import React from "react";
import {
  Container,
  TextField,
  Button,
  IconButton,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  withStyles,
  LinearProgress,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import { useTodos } from "./useTodos";
import { useDraftTodos } from "./useDraftTodos";
import { useShowLoader } from "./util-hooks";

export function TodoItemsPage() {
  const { loading, todos, ...todoActions } = useTodos();
  const { draftTodos, ...draftTodoActions } = useDraftTodos();
  const showLoader = useShowLoader(loading, 200);
  return (
    <Container className="main-container" maxWidth="sm">
      {loading ? (showLoader ? <LinearProgress /> : null) : (
        <div className="todo-items-container">
          <Typography component="p" variant="h5">
            {`You have ${todos.length} To-Do Item${
              todos.length === 1 ? "" : "s"
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
          <List style={{ width: "100%" }}>
            {todos.map((todo) => (
              <TodoItem
                key={String(todo._id)}
                todo={todo}
                todoActions={todoActions}
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
  );
}

function TodoItem({ isDraft = false, todo, todoActions }) {
  const toggleIsCompleted = () => {
    todoActions.toggleTodo(todo);
  };
  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={todo.isComplete}
          onClick={toggleIsCompleted}
        />
      </ListItemIcon>
      <ListItemText>{todo.summary}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton edge="end" size="small" 
          onClick={() => {
            todoActions.deleteTodo(todo)
          }}>
          <ClearIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const ListItemWithTwoSecondaryActions = withStyles({
  secondaryAction: {
    paddingRight: "120px",
  },
})(ListItem);
function DraftTodoItem({ todo, todoActions, draftTodoActions }) {
  return (
    <ListItemWithTwoSecondaryActions>
      <ListItemText inset>
        <TextField
          style={{ width: "100%" }}
          placeholder="What needs doing?"
          size="small"
          value={todo.summary}
          onChange={(e) => {
            draftTodoActions.setDraftTodoSummary(todo, e.target.value);
          }}
        />
      </ListItemText>
      <ListItemSecondaryAction>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => {
            todoActions.saveTodo(todo)
            draftTodoActions.deleteDraftTodo(todo)
          }}
        >
          Save
        </Button>
        <IconButton
          edge="end"
          size="small"
          onClick={() => {
            draftTodoActions.deleteDraftTodo(todo)
          }}
        >
          <ClearIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemWithTwoSecondaryActions>
  );
}
