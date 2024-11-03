const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL;

describe('Update Config Endpoint', () => {
    it('should update config and return updated values', async () => {
        // First get the current config
        const getConfigResponse = await axios.get(`${API_URL}/config`, {
            headers: {
                username: process.env.VALID_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        });

        const originalConfig = getConfigResponse.data;

        // Update a test field
        const testValue = `test_${Date.now()}`;
        const updateData = {
            TEST_FIELD: testValue
        };

        const response = await axios.patch(`${API_URL}/config`, updateData, {
            headers: {
                username: process.env.VALID_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        });

        // Verify response
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('PK', 'pam-config');
        expect(response.data).toHaveProperty('SK', '1');
        expect(response.data).toHaveProperty('TEST_FIELD', testValue);

        // Verify original fields are preserved
        Object.keys(originalConfig).forEach(key => {
            if (key !== 'TEST_FIELD') {
                expect(response.data).toHaveProperty(key, originalConfig[key]);
            }
        });
    });

    it('should reject unauthenticated requests', async () => {
        try {
            await axios.patch(`${API_URL}/config`, { TEST_FIELD: 'test' });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    it('should reject invalid JSON', async () => {
        try {
            await axios.patch(`${API_URL}/config`, 'invalid json', {
                headers: {
                    username: process.env.VALID_USERNAME,
                    password: process.env.VALID_PASSWORD,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });

    it('should update config with an array of objects', async () => {
        const updateData = {
            TEST_ARRAY: [
                {
                    key1: 'value1',
                    key2: 'value2'
                },
                {
                    key1: 'value3',
                    key2: 'value4'
                }
            ]
        };

        const response = await axios.patch(`${API_URL}/config`, updateData, {
            headers: {
                username: process.env.VALID_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('TEST_ARRAY');
        expect(Array.isArray(response.data.TEST_ARRAY)).toBeTruthy();
        expect(response.data.TEST_ARRAY).toHaveLength(2);
        expect(response.data.TEST_ARRAY[0]).toEqual({
            key1: 'value1',
            key2: 'value2'
        });
        expect(response.data.TEST_ARRAY[1]).toEqual({
            key1: 'value3',
            key2: 'value4'
        });
    });
});
