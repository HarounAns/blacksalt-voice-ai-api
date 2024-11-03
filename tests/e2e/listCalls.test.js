const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL;
const RETELL_AGENT_ID = process.env.RETELL_AGENT_ID;

console.log(`${API_URL}/calls`);

describe('List Calls Endpoint', () => {
    it('should list calls for authenticated user', async () => {
        const response = await axios.post(`${API_URL}/calls`, {}, {
            headers: {
                username: process.env.VALID_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        });

        console.log(response.data);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();
        expect(response.data.length).toBeGreaterThan(0);
    });

    it('should reject unauthenticated requests', async () => {
        try {
            await axios.post(`${API_URL}/calls`, {});
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    it('should use server-side agent_id regardless of input', async () => {
        const differentAgentId = 'agent_different_id_123456';
        const response = await axios.post(`${API_URL}/calls`,
            { agent_id: differentAgentId },
            {
                headers: {
                    username: process.env.VALID_USERNAME,
                    password: process.env.VALID_PASSWORD
                }
            }
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();
        expect(response.data.length).toBeGreaterThan(0);

        // Check that all calls have the correct agent_id
        response.data.forEach(call => {
            expect(call).toHaveProperty('agent_id', RETELL_AGENT_ID);
            expect(call.agent_id).not.toBe(differentAgentId);
        });

        console.log(`All calls use the server-side agent_id (${RETELL_AGENT_ID}) instead of the provided one (${differentAgentId})`);
    });
});

describe('List Calls Endpoint Pagination', () => {
    it('should handle pagination correctly', async () => {
        // First request with limit=1 and descending order
        const firstResponse = await axios.post(`${API_URL}/calls`,
            { 
                limit: 1,
                sort_order: "descending"
            },
            {
                headers: {
                    username: process.env.VALID_USERNAME,
                    password: process.env.VALID_PASSWORD
                }
            }
        );

        expect(firstResponse.status).toBe(200);
        expect(Array.isArray(firstResponse.data)).toBeTruthy();
        expect(firstResponse.data.length).toBe(1);

        const firstCall = firstResponse.data[0];
        console.log('First call:', firstCall);

        // Second request using the first call's ID as pagination key
        const secondResponse = await axios.post(`${API_URL}/calls`,
            {
                limit: 1,
                sort_order: "descending",
                pagination_key: firstCall.call_id
            },
            {
                headers: {
                    username: process.env.VALID_USERNAME,
                    password: process.env.VALID_PASSWORD
                }
            }
        );

        expect(secondResponse.status).toBe(200);
        expect(Array.isArray(secondResponse.data)).toBeTruthy();
        expect(secondResponse.data.length).toBe(1);
        
        const secondCall = secondResponse.data[0];
        console.log('Second call:', secondCall);

        // Verify we got different calls
        expect(secondCall.call_id).not.toBe(firstCall.call_id);

        // Verify both calls have the correct agent_id
        expect(firstCall.agent_id).toBe(RETELL_AGENT_ID);
        expect(secondCall.agent_id).toBe(RETELL_AGENT_ID);

        console.log('Pagination test successful:');
        console.log('First call ID:', firstCall.call_id);
        console.log('Second call ID:', secondCall.call_id);
    });
});
