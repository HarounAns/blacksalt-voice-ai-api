const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL;
const VALID_USERNAME = process.env.VALID_USERNAME;
const VALID_PASSWORD = process.env.VALID_PASSWORD;

describe('Auth Endpoint', () => {
    it('should authenticate with valid credentials', async () => {
        const response = await axios.post(`${API_URL}/auth`, {
            username: VALID_USERNAME,
            password: VALID_PASSWORD
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('message', 'Authentication successful');
    });

    it('should reject invalid credentials', async () => {
        try {
            await axios.post(`${API_URL}/auth`, {
                username: 'invalidUsername',
                password: 'invalidPassword'
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toHaveProperty('message', 'Authentication failed');
        }
    });
});
