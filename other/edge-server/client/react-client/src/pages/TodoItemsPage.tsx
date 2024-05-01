import { Button, Typography, List, LinearProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { TodoItem } from "../components/TodoItem";
import { DraftTodoItem } from "../components/DraftTodoItem";

import { useTodos } from "../hooks/useTodos";
import { useDraftTodos } from "../hooks/useDraftTodos";
import { useShowLoader } from "../hooks/util-hooks";
import { getTodoId } from "../utils";

export function TodoItemsPage() {
  const { loading, todos, ...todoActions } = useTodos();
  const { draftTodos, ...draftTodoActions } = useDraftTodos();
  const showLoader = useShowLoader(loading, 200);

  return (
    <div>
      {loading ? (
        showLoader ? (
          <LinearProgress />
        ) : null
      ) : (
        <div className="todo-items-container">
          <Typography
            component="h2"
            variant="h4"
            gutterBottom
          >
            You have {todos.length} To-Do Item{todos.length === 1 ? "" : "s"}
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
            {draftTodos.map((draft) => (
              <DraftTodoItem
                key={getTodoId(draft)}
                todo={draft}
                todoActions={todoActions}
                draftTodoActions={draftTodoActions}
              />
            ))}
            {todos.length &&
              todos.map((todo) => (
                <TodoItem
                  key={getTodoId(todo)}
                  todo={todo}
                  todoActions={todoActions}
                />
              ))}
          </List>
        </div>
      )}
    </div>
  );
}
