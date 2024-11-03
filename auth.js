const AWS = require('aws-sdk');
const { formatResponse } = require('./util');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function authenticate(username, password) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            PK: 'auth-credentials',
            SK: '1'
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        const storedCredentials = result.Item;

        return storedCredentials &&
            storedCredentials.username === username &&
            storedCredentials.password === password;
    } catch (error) {
        console.error('Error during authentication:', error);
        return false;
    }
}

exports.handler = async (event) => {
    try {
        const { username, password } = JSON.parse(event.body);

        if (await authenticate(username, password)) {
            return formatResponse(200, { message: 'Authentication successful' });
        } else {
            return formatResponse(401, { message: 'Authentication failed' });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        return formatResponse(500, { error: 'Internal Server Error' });
    }
};

exports.authenticate = authenticate;
