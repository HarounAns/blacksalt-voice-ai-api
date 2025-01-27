const { createOpenStatusString } = require('./util');

// Mock store hours (same as in tests)
const mockHours = {
    monday: null,  // Closed
    tuesday: { open: "17:00", close: "23:00" },
    wednesday: { open: "17:00", close: "23:00" },
    thursday: { open: "17:00", close: "23:00" },
    friday: { open: "17:00", close: "00:00" },
    saturday: { open: "17:00", close: "00:00" },
    sunday: { open: "17:00", close: "23:00" }
};

// Test current time
console.log('Current UTC:', new Date().toISOString());
console.log('Current EST:', new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
console.log('\nStore Status:', createOpenStatusString(mockHours)); 