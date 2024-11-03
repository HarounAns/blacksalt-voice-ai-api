const axios = require('axios');
const { authenticate } = require('./auth');
const { formatResponse } = require('./util');

module.exports.handler = async (event) => {
    try {
        const { username, password } = event.headers;
        if (!await authenticate(username, password)) {
            return formatResponse(401, { message: 'Authentication failed' });
        }

        const retellApiKey = process.env.RETELL_API_KEY;
        const retellAgentId = process.env.RETELL_AGENT_ID;
        const retellApiUrl = 'https://api.retellai.com/v2/list-calls';

        // Parse request body if it exists
        let requestBody = {};
        if (event.body) {
            try {
                requestBody = JSON.parse(event.body);
                console.debug('Parsed request body:', requestBody);
            } catch (parseError) {
                console.error('Error parsing request body:', parseError);
                return formatResponse(400, { error: 'Invalid JSON in request body' });
            }
        }

        console.debug('Sending request to Retell API');
        const response = await axios.post(retellApiUrl, requestBody, {
            headers: {
                'Authorization': `Bearer ${retellApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Filter the response to only include calls with matching agent_id
        const filteredCalls = response.data.filter(call => call.agent_id === retellAgentId);
        console.debug(`Filtered ${response.data.length} calls to ${filteredCalls.length} calls with agent_id: ${retellAgentId}`);

        return formatResponse(200, filteredCalls);
    } catch (error) {
        console.error('Error listing calls:', error);
        return formatResponse(500, { error: 'Internal Server Error' });
    }
};
