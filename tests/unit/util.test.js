const { createFAQString } = require("../../util");

describe('Retell Inbound Webhook', () => {
    const mockFaqData = [
        {
            question: "Is your meat halal?",
            answer: "Yes, all of our meat is 100% halal."
        },
        {
            question: "Where are you located?",
            answer: "We're at **2826 Fallfax Dr, Falls Church, VA 22042**, between the Hookah Lounge and the Brewery."
        },
        {
            question: "What are your hours?",
            answer: "Our hours are flexible as we're still getting started. Please check our Instagram **@blacksaltblacksugar** for updates. Generally:\n- **Friday & Saturday**: 5 PM – 12 AM\n- **Sunday – Thursday**: 5 PM – 11 PM"
        },
        {
            question: "Are you accepting reservations?",
            answer: "Currently, we are not accepting reservations."
        },
        {
            question: "Do you offer delivery?",
            answer: "At this time, we do not offer delivery."
        }
    ];

    describe('createFAQString', () => {
        it('should format FAQ data correctly', () => {
            const expected = `**Is your meat halal?**
Yes, all of our meat is 100% halal.

**Where are you located?**
We're at **2826 Fallfax Dr, Falls Church, VA 22042**, between the Hookah Lounge and the Brewery.

**What are your hours?**
Our hours are flexible as we're still getting started. Please check our Instagram **@blacksaltblacksugar** for updates. Generally:
- **Friday & Saturday**: 5 PM – 12 AM
- **Sunday – Thursday**: 5 PM – 11 PM

**Are you accepting reservations?**
Currently, we are not accepting reservations.

**Do you offer delivery?**
At this time, we do not offer delivery.
`;

            expect(createFAQString(mockFaqData)).toBe(expected);
        });

        it('should handle empty FAQ data', () => {
            expect(createFAQString([])).toBe('');
        });

        it('should handle single FAQ item', () => {
            const singleFaqData = [{
                question: "Test question?",
                answer: "Test answer."
            }];
            const expected = `**Test question?**
Test answer.
`;
            expect(createFAQString(singleFaqData)).toBe(expected);
        });
    });
});