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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodoCollection = exports.connectToEdgeServer = void 0;
const mongodb_1 = require("mongodb");
const uri = process.env.EDGE_SERVER_URI;
const client = new mongodb_1.MongoClient(uri);
const database = client.db("todo");
const todos = database.collection("Item");
const connectToEdgeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
    console.log(`Connected to Atlas Edge Server at: ${uri}`);
});
exports.connectToEdgeServer = connectToEdgeServer;
const getTodoCollection = () => {
    return todos;
};
exports.getTodoCollection = getTodoCollection;
