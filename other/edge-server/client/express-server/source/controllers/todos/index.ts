import { Response, Request } from "express";
import { ObjectId } from "mongodb";
import { getTodoCollection } from "../../db/mongoUtils.js";
import { Todo } from "../../types/types.js";

const getTodos = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const todoCollection = getTodoCollection();
    const cursor = todoCollection.find();
    let todos: Todo[] = [];

    for await (const todo of cursor) {
      todos.push(todo);
    }

    response.status(200).json(todos);
  } catch (error) {
    response.status(502).json({
      message: "Could not get Todos from Edge Server. Is it running?",
    });
  }
};

const addTodo = async (request: Request, response: Response): Promise<void> => {
  try {
    const body = request.body as Pick<Todo, "_id" | "summary" | "isComplete">;
    const todo: Todo = {
      _id: new ObjectId(body._id),
      owner_id: "edge",
      summary: body.summary,
      isComplete: body.isComplete,
    };
    const todoCollection = getTodoCollection();
    const newTodo = await todoCollection.insertOne(todo);
    const allTodos = todoCollection.find();

    response
      .status(201)
      .json({ message: "Todo added", todo: newTodo, todos: allTodos });
  } catch (error) {
    response
      .status(502)
      .json({ message: "Could not add Todo to Edge Server. Is it running?" });
  }
};

const updateTodo = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const body = request.body as Pick<Todo, "_id" | "summary" | "isComplete">;
    const todoCollection = getTodoCollection();

    const result = await todoCollection.updateOne(
      { _id: new ObjectId(request.params.id) },
      {
        $set: { isComplete: body.isComplete },
      }
    );

    if (result.acknowledged) {
      const allTodos = todoCollection.find();

      response.status(200).json({
        message: "Todo updated",
        todo: updateTodo,
        todos: allTodos,
      });
    } else {
      response.status(404).json({
        message: "Todo not found",
      });
    }
  } catch (error) {
    response.status(502).json({
      message: "Could not update Todo on Edge Server. Is it running?",
    });
  }
};

const deleteTodo = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const todoCollection = getTodoCollection();
    const todo = await todoCollection.findOne({
      _id: new ObjectId(request.params.id),
    });

    if (todo) {
      const allTodos = todoCollection.find();
      await todoCollection.deleteOne(todo);

      response.status(200).json({
        message: "Todo deleted",
        todo: todo,
        todos: allTodos,
      });
    } else {
      response.status(404).json({
        message: `Todo with id ${request.params.id} not found`,
      });
    }
  } catch (error) {
    response.status(502).json({
      message: "Could not delete Todo on Edge Server. Is it running?",
    });
  }
};

export { getTodos, addTodo, updateTodo, deleteTodo };
