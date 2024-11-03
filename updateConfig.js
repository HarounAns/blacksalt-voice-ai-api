const AWS = require('aws-sdk');
const { authenticate } = require('./auth');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        const { username, password } = event.headers;
        if (!await authenticate(username, password)) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Authentication failed' })
            };
        }

        let updates;
        try {
            updates = JSON.parse(event.body);
            // Verify it's an object, not a string or array
            if (typeof updates !== 'object' || Array.isArray(updates) || updates === null) {
                throw new Error('Request body must be a JSON object');
            }
        } catch (parseError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid JSON in request body' })
            };
        }

        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        Object.keys(updates).forEach((key, index) => {
            updateExpression.push(`#field${index} = :value${index}`);
            expressionAttributeNames[`#field${index}`] = key;
            expressionAttributeValues[`:value${index}`] = updates[key];
        });

        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                PK: 'pam-config',
                SK: '1'
            },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamoDB.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes)
        };
    } catch (error) {
        console.error('Error updating config:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
