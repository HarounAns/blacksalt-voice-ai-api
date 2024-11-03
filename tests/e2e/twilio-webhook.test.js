require('dotenv').config();
const axios = require('axios');

const API_URL = `${process.env.API_URL}/twilio-webhook`;

describe('Twilio Webhook API', () => {
    it('should return a valid TwiML response', async () => {
        const response = await axios.post(API_URL, {}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('text/xml');
        expect(response.data).toContain('<Response>');
        expect(response.data).toContain('<Dial>');
        expect(response.data).toContain('</Response>');
    });
});