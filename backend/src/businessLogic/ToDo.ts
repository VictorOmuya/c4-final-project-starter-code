import {TodoUpdate} from "../models/TodoUpdate";
import {ToDoAccess} from "../dataLayer/ToDoAccess";
import {TodoItem} from "../models/TodoItem";
import {parseUserId} from "../auth/utils";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";


const uuidv4 = require('uuid/v4');
const toDoAccess = new ToDoAccess();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const user_id = parseUserId(jwtToken);
    return toDoAccess.getAllToDo(user_id);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const user_id = parseUserId(jwtToken);
    const todo_id =  uuidv4();
    const s3_bucket_name = process.env.S3_BUCKET_NAME;
    
    return toDoAccess.createToDo({
        userId: user_id,
        todoId: todo_id,
        attachmentUrl:  `https://${s3_bucket_name}.s3.amazonaws.com/${todo_id}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todo_id: string, jwtToken: string): Promise<TodoUpdate> {
    const user_id = parseUserId(jwtToken);
    return toDoAccess.updateToDo(updateTodoRequest, todo_id, user_id);
}

export function deleteToDo(todo_id: string, jwtToken: string): Promise<string> {
    const user_id = parseUserId(jwtToken);
    return toDoAccess.deleteToDo(todo_id, user_id);
}

export function generateUploadUrl(todo_id: string): Promise<string> {
    return toDoAccess.generateUploadUrl(todo_id);
}