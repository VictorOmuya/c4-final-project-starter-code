import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {generateUploadUrl} from "../../businessLogic/ToDo";


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   
    console.log("event processing....", event);
    const todo_id = event.pathParameters.todoId;
    const img_url = await generateUploadUrl(todo_id);
    return {
        statusCode: 202,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            uploadUrl: img_url,
        })
    };
};