const twilio = require('twilio');
const AWS = require('aws-sdk');
const { formatResponse } = require('./util');
const VoiceResponse = twilio.twiml.VoiceResponse;

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
    console.log('Incoming Twilio webhook:', JSON.stringify(event, null, 2));

    const config = await getConfig();
    const twiml = new VoiceResponse();

    if (config.FORWARD_TO_PAM) {
      console.log('Forwarding call to PAM:', config.PAM_PHONE_NUMBER);
      twiml.dial(config.PAM_PHONE_NUMBER);
    } else {
      console.log('Forwarding call to fallback number:', config.FALLBACK_NUMBER);
      twiml.dial(config.FALLBACK_NUMBER);
    }

    return formatResponse(200, twiml.toString(), 'text/xml');
  } catch (error) {
    console.error('Error processing Twilio webhook:', error);
    return formatResponse(500, { error: 'Internal Server Error' });
  }
};
