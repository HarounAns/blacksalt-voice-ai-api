require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.API_URL;

describe('Retell Inbound Webhook API', () => {
    it('should return FAQ data', async () => {
        const response = await axios.post(`${API_URL}/retell-inbound-webhook`);
        expect(response.status).toBe(200);

        const faqContent = response.data.faqString;
        const isOpenRightNow = response.data.isOpenRightNow;

        console.log({ faqContent, isOpenRightNow });

        // Test FAQ content with exact matches
        expect(faqContent).toContain('**Is your meat halal?**');
        expect(faqContent).toContain('Yes, all of our meat is 100% halal.');

        expect(faqContent).toContain('**Where are you located?**');
        expect(faqContent).toContain('We\'re at 2826 Fallfax Dr, Falls Church, VA 22042');

        expect(faqContent).toContain('**What are your hours?**');
        expect(faqContent).toContain('Our hours are flexible as we\'re still getting started. Please check our Instagram `at black salt black sugar` for updates. Generally:\n- Friday & Saturday: 5 PM - 12 AM\n- Sunday - Thursday: 5 PM - 11 PM');

        expect(faqContent).toContain('**Are you accepting reservations?**');
        expect(faqContent).toContain('Currently, we\'re not accepting reservations.');

        expect(faqContent).toContain('**Do you offer delivery?**');
        expect(faqContent).toContain('At this time we do not offer delivery.');

        expect(faqContent).toContain('**Is Black Sugar Open yet?**');
        expect(faqContent).toContain('No Black Sugar isn\'t open yet, it\'s just Black Salt currently.');

        expect(faqContent).toContain('**Do you offer any ethical alternatives to Coca-Cola?**');
        expect(faqContent).toContain('Yes we offer Salaam Cola!');

        expect(faqContent).toContain('**Do you serve alcohol?**');
        expect(faqContent).toContain('No we don\'t serve any alcohol.');

        expect(response.data).toHaveProperty('isOpenRightNow');
        expect(response.data.isOpenRightNow).toMatch(/^Open Status: (Open|Closed)\nReason: .+$/);
    });
});
