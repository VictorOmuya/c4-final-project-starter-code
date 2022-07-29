
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from 'aws-sdk/clients/s3';
import * as AWS from "aws-sdk";


export class ToDoAccess {
    constructor(
        private readonly doc_client: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly s3_client: Types = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly todo_table = process.env.TODOS_TABLE,
        private readonly my_s3_bucketName = process.env.S3_BUCKET_NAME) {
    }

    async getAllToDo(userId: string): Promise<TodoItem[]> {
        console.log("getting all the todos");

        const params = {
            TableName: this.todo_table,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const result = await this.doc_client.query(params).promise();
        console.log(result);
        const items = result.Items;

        return items as TodoItem[];
    }

    async createToDo(todoItem: TodoItem): Promise<TodoItem> {
        console.log("creating a new todo item");

        const params = {
            TableName: this.todo_table,
            Item: todoItem,
        };

        const result = await this.doc_client.put(params).promise();
        console.log(result);

        return todoItem as TodoItem;
    }

    async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        console.log("Updating a todo item");

        const params = {
            TableName: this.todo_table,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "name",
                "#b": "dueDate",
                "#c": "done"
            },
            ExpressionAttributeValues: {
                ":a": todoUpdate['name'],
                ":b": todoUpdate['dueDate'],
                ":c": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await this.doc_client.update(params).promise();
        console.log(result);
        const attributes = result.Attributes;

        return attributes as TodoUpdate;
    }

    async deleteToDo(todoId: string, userId: string): Promise<string> {
        console.log("Deleting a particular Todo item");

        const params = {
            TableName: this.todo_table,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        const output = await this.doc_client.delete(params).promise();
        console.log(output);

        return "" as string;
    }

    async generateUploadUrl(todoId: string): Promise<string> {
        console.log("Generating an upload URL");

        const upload_url = this.s3_client.getSignedUrl('putObject', {
            Bucket: this.my_s3_bucketName,
            Key: todoId,
            Expires: 1000,
        });
        console.log(upload_url);

        return upload_url as string;
    }
}
