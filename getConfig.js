const AWS = require('aws-sdk');
const { authenticate } = require('./auth');
const { formatResponse } = require('./util');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    console.log('Fetching config', event);
    try {
        const { username, password } = event.headers;
        if (!await authenticate(username, password)) {
            return formatResponse(401, { message: 'Authentication failed' });
        }

        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                PK: 'pam-config',
                SK: '1'
            }
        };

        const result = await dynamoDB.get(params).promise();
        return formatResponse(200, result.Item);
    } catch (error) {
        console.error('Error fetching config:', error);
        return formatResponse(500, { error: 'Internal Server Error' });
    }
};
