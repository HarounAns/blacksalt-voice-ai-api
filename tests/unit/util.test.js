const { createFAQString } = require("../../util");
const { isStoreOpen, getStoreStatus } = require('../../util');
const { createOpenStatusString } = require("../../util");

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

describe('Store Hours Utilities', () => {
  // Update mock hours to reflect Monday being closed
  const mockHours = {
    monday: null,  // Changed to null to indicate closed
    tuesday: { open: "17:00", close: "23:00" },
    wednesday: { open: "17:00", close: "23:00" },
    thursday: { open: "17:00", close: "23:00" },
    friday: { open: "17:00", close: "00:00" },
    saturday: { open: "17:00", close: "00:00" },
    sunday: { open: "17:00", close: "23:00" }
  };

  beforeEach(() => {
    // Reset any mocked dates between tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isStoreOpen', () => {
    it('should return false when hours are null', () => {
      expect(isStoreOpen(null)).toBe(false);
    });

    it('should return false when hours are undefined', () => {
      expect(isStoreOpen(undefined)).toBe(false);
    });

    it('should return false before opening time', () => {
      // Set time to 16:59 on a Wednesday
      const testDate = new Date('2024-01-17T16:59:00');
      jest.setSystemTime(testDate);
      
      expect(isStoreOpen(mockHours)).toBe(false);
    });

    it('should return true during business hours', () => {
      // Set time to 19:30 on a Wednesday
      const testDate = new Date('2024-01-17T19:30:00');
      jest.setSystemTime(testDate);
      
      expect(isStoreOpen(mockHours)).toBe(true);
    });

    it('should return false after closing time on regular day', () => {
      // Set time to 23:01 on a Wednesday
      const testDate = new Date('2024-01-17T23:01:00');
      jest.setSystemTime(testDate);
      
      expect(isStoreOpen(mockHours)).toBe(false);
    });

    it('should handle midnight closing time correctly (before midnight)', () => {
      // Set time to 23:30 on a Friday
      const testDate = new Date('2024-01-19T23:30:00');
      jest.setSystemTime(testDate);
      
      expect(isStoreOpen(mockHours)).toBe(true);
    });

    it('should handle missing day data', () => {
      const incompleteHours = {
        monday: { open: "17:00", close: "23:00" }
        // missing other days
      };
      
      // Set time to 19:30 on a Tuesday
      const testDate = new Date('2024-01-16T19:30:00');
      jest.setSystemTime(testDate);
      
      expect(isStoreOpen(incompleteHours)).toBe(false);
    });

    it('should return false on Monday when store is closed', () => {
      // Set time to Monday at 19:30 (when it would normally be open)
      const testDate = new Date('2024-01-15T19:30:00');
      jest.setSystemTime(testDate);
      
      expect(isStoreOpen(mockHours)).toBe(false);
    });
  });

  describe('getStoreStatus', () => {
    it('should return correct status when store is open', () => {
      // Set time to 19:30 on a Wednesday
      const testDate = new Date('2024-01-17T19:30:00');
      jest.setSystemTime(testDate);
      
      const status = getStoreStatus(mockHours);
      expect(status).toEqual({
        isOpen: true,
        todayHours: {
          open: "17:00",
          close: "23:00"
        },
        currentDay: "wednesday"
      });
    });

    it('should return correct status when store is closed', () => {
      // Set time to 16:30 on a Wednesday
      const testDate = new Date('2024-01-17T16:30:00');
      jest.setSystemTime(testDate);
      
      const status = getStoreStatus(mockHours);
      expect(status).toEqual({
        isOpen: false,
        todayHours: {
          open: "17:00",
          close: "23:00"
        },
        currentDay: "wednesday"
      });
    });

    it('should handle null hours gracefully', () => {
      const status = getStoreStatus(null);
      expect(status).toEqual({
        isOpen: false,
        todayHours: null,
        currentDay: expect.any(String) // actual day depends on test execution time
      });
    });

    it('should handle missing day data', () => {
      const incompleteHours = {
        monday: { open: "17:00", close: "23:00" }
        // missing other days
      };
      
      // Set time to 19:30 on a Tuesday
      const testDate = new Date('2024-01-16T19:30:00');
      jest.setSystemTime(testDate);
      
      const status = getStoreStatus(incompleteHours);
      expect(status).toEqual({
        isOpen: false,
        todayHours: null,
        currentDay: "tuesday"
      });
    });

    it('should return correct status for closed Monday', () => {
      // Set time to Monday at 19:30
      const testDate = new Date('2024-01-15T19:30:00');
      jest.setSystemTime(testDate);
      
      const status = getStoreStatus(mockHours);
      expect(status).toEqual({
        isOpen: false,
        todayHours: null,
        currentDay: "monday"
      });
    });
  });
});

describe('createOpenStatusString', () => {
    const mockHours = {
        monday: null,  // Changed to null to indicate closed
        tuesday: { open: "17:00", close: "23:00" },
        wednesday: { open: "17:00", close: "23:00" },
        thursday: { open: "17:00", close: "23:00" },
        friday: { open: "17:00", close: "00:00" },
        saturday: { open: "17:00", close: "00:00" },
        sunday: { open: "17:00", close: "23:00" }
    };

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should show open status when store is open', () => {
        // Set time to Wednesday 7:30 PM
        jest.setSystemTime(new Date('2024-01-17T19:30:00'));
        
        const status = createOpenStatusString(mockHours);
        expect(status).toBe('Open Status: Open\nReason: We are currently open and will close today at 23:00');
    });

    it('should show closed status with today\'s opening time when before opening hours', () => {
        // Set time to Wednesday 3:30 PM (before opening)
        jest.setSystemTime(new Date('2024-01-17T15:30:00'));
        
        const status = createOpenStatusString(mockHours);
        expect(status).toBe('Open Status: Closed\nReason: We are currently closed and will open today at 17:00');
    });

    it('should show closed status with tomorrow\'s opening time when after closing', () => {
        // Set time to Wednesday 11:30 PM (after closing)
        jest.setSystemTime(new Date('2024-01-17T23:30:00'));
        
        const status = createOpenStatusString(mockHours);
        expect(status).toBe('Open Status: Closed\nReason: We are currently closed and will open thursday at 17:00');
    });

    it('should handle special hours for tomorrow (Friday -> Saturday)', () => {
        // Set time to Friday 11:30 PM
        jest.setSystemTime(new Date('2024-01-19T23:30:00'));
        
        const status = createOpenStatusString(mockHours);
        expect(status).toBe('Open Status: Open\nReason: We are currently open and will close today at 00:00');
    });

    describe('edge cases', () => {
        it('should handle null hours', () => {
            const status = createOpenStatusString(null);
            expect(status).toBe('Open Status: Closed\nReason: We are currently closed and will open tomorrow at 17:00');
        });

        it('should handle missing hours for current day', () => {
            const incompleteHours = {
                tuesday: { open: "17:00", close: "23:00" }
            };
            // Set time to Monday
            jest.setSystemTime(new Date('2024-01-15T15:30:00'));
            
            const status = createOpenStatusString(incompleteHours);
            expect(status).toBe('Open Status: Closed\nReason: We are currently closed and will open tuesday at 17:00');
        });

        it('should handle missing hours for next day', () => {
            const incompleteHours = {
                monday: { open: "17:00", close: "23:00" }
            };
            // Set time to Monday 11:30 PM
            jest.setSystemTime(new Date('2024-01-15T23:30:00'));
            
            const status = createOpenStatusString(incompleteHours);
            expect(status).toBe('Open Status: Closed\nReason: We are currently closed and will open tomorrow at 17:00');
        });
    });

    it('should show closed status on Monday with next opening time', () => {
      // Set time to Monday at 19:30
      jest.setSystemTime(new Date('2024-01-15T19:30:00'));
      
      const status = createOpenStatusString(mockHours);
      expect(status).toBe('Open Status: Closed\nReason: We are currently closed and will open tuesday at 17:00');
    });
});