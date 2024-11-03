require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.API_URL;

describe('Retell Inbound Webhook API', () => {
    it('should return FAQ data', async () => {
        const response = await axios.post(`${API_URL}/retell-inbound-webhook`, {});

        console.log('Retell inbound webhook response:', JSON.stringify(response.data, null, 2));

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.data).toHaveProperty('faqString');
        expect(typeof response.data.faqString).toBe('string');

        // Check for specific content in the FAQ
        const faqContent = response.data.faqString;
        expect(faqContent).toContain('**Is your meat halal?**');
        expect(faqContent).toContain('Yes, all of our meat is 100% halal.');
        expect(faqContent).toContain('**Where are you located?**');
        expect(faqContent).toContain('We\'re at 2826 Fallfax Dr, Falls Church, VA 22042, between the Hookah Lounge and the Brewery.');
        expect(faqContent).toContain('**What are your hours?**');
        expect(faqContent).toContain('Our hours are flexible as we\'re still getting started. Please check our Instagram `at black salt black sugar` for updates. Generally:\n- Friday & Saturday: 5 PM - 12 AM\n- Sunday - Thursday: 5 PM - 11 PM');
        expect(faqContent).toContain('**Are you accepting reservations?**');
        expect(faqContent).toContain('Currently, we are not accepting reservations.');
        expect(faqContent).toContain('**Do you offer delivery?**');
        expect(faqContent).toContain('At this time, we do not offer delivery.');
    });
});
