const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL;

describe('Get Config Endpoint', () => {
    it('should return config for authenticated user', async () => {
        const response = await axios.get(`${API_URL}/config`, {
            headers: {
                username: process.env.VALID_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        });

        console.log(JSON.stringify({ data: response.data }, null, 2));

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('PK', 'pam-config');
    });

    it('should reject unauthenticated requests', async () => {
        try {
            await axios.get(`${API_URL}/config`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });
});
