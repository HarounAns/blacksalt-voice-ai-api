const AWS = require('aws-sdk');
const { createFAQString } = require("./util");
const { formatResponse } = require('./util');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getConfig() {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            PK: 'pam-config',
            SK: '1'
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        return result.Item;
    } catch (error) {
        console.error('Error fetching config from DynamoDB:', error);
        throw error;
    }
}

module.exports.handler = async (event) => {
    try {
        console.log('Incoming Retell webhook:', JSON.stringify(event, null, 2));

        const config = await getConfig();
        const faqString = createFAQString(config.FAQ);

        return formatResponse(200, { faqString });
    } catch (error) {
        console.error('Error processing Retell webhook:', error);
        return formatResponse(500, { error: 'Internal Server Error' });
    }
};
