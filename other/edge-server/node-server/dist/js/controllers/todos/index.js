"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.addTodo = exports.getTodos = void 0;
const mongodb_1 = require("mongodb");
const connect_js_1 = require("../../db/connect.js");
const getTodos = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const todoCollection = (0, connect_js_1.getTodoCollection)();
        const cursor = todoCollection.find();
        let todos = [];
        try {
            for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
                _c = cursor_1_1.value;
                _d = false;
                const todo = _c;
                console.dir(todo);
                todos.push(todo);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        response.status(200).json(todos);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
});
exports.getTodos = getTodos;
const addTodo = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const todo = {
            _id: new mongodb_1.ObjectId(body._id),
            summary: body.summary,
            isComplete: body.isComplete,
        };
        const todoCollection = (0, connect_js_1.getTodoCollection)();
        const newTodo = yield todoCollection.insertOne(todo);
        const allTodos = todoCollection.find();
        response
            .status(201)
            .json({ message: "Todo added", todo: newTodo, todos: allTodos });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
});
exports.addTodo = addTodo;
const updateTodo = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const todoCollection = (0, connect_js_1.getTodoCollection)();
        const result = yield todoCollection.updateOne({ _id: new mongodb_1.ObjectId(request.params.id) }, {
            $set: { isComplete: body.isComplete },
        });
        if (result.acknowledged) {
            const allTodos = todoCollection.find();
            response.status(200).json({
                message: "Todo updated",
                todo: updateTodo,
                todos: allTodos,
            });
        }
        else {
            response.status(404).json({
                message: "Todo not found",
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoCollection = (0, connect_js_1.getTodoCollection)();
        const todo = yield todoCollection.findOne({
            _id: new mongodb_1.ObjectId(request.params.id),
        });
        if (todo) {
            const allTodos = todoCollection.find();
            yield todoCollection.deleteOne(todo);
            response.status(200).json({
                message: "Todo deleted",
                todo: todo,
                todos: allTodos,
            });
        }
        else {
            response.status(404).json({
                message: `Todo with id ${request.params.id} not found`,
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
});
exports.deleteTodo = deleteTodo;
