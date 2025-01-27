function createFAQString(faqArray) {
    return faqArray.map(item => `**${item.question}**\n${item.answer}\n`).join('\n');
}


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};
const formatResponse = (statusCode, body, contentType = 'application/json') => ({
    statusCode,
    headers: {
        'Content-Type': contentType,
        ...corsHeaders,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
});

function getCurrentDayName() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
}

function parseTimeString(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function isStoreOpen(hours) {
  if (!hours) return false;
  
  const now = new Date();
  const currentDay = getCurrentDayName();
  const todayHours = hours[currentDay];
  
  if (!todayHours || !todayHours.open || !todayHours.close) return false;
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const openTime = parseTimeString(todayHours.open);
  const closeTime = parseTimeString(todayHours.close);
  
  const openMinutes = openTime.getHours() * 60 + openTime.getMinutes();
  const closeMinutes = closeTime.getHours() * 60 + closeTime.getMinutes();
  
  // Handle midnight crossover (when close time is 00:00)
  if (closeMinutes === 0) {
    // If it's before midnight and after opening time
    return currentTime >= openMinutes;
  }
  
  // Normal case
  return currentTime >= openMinutes && currentTime < closeMinutes;
}

function getStoreStatus(hours) {
  const isOpen = isStoreOpen(hours);
  const currentDay = getCurrentDayName();
  const todayHours = hours?.[currentDay];
  
  return {
    isOpen,
    todayHours: todayHours ? {
      open: todayHours.open,
      close: todayHours.close
    } : null,
    currentDay
  };
}

function createOpenStatusString(hours) {
    // Handle null/undefined hours upfront
    if (!hours) {
        return 'Open Status: Closed\nReason: We are currently closed and will open tomorrow at 17:00';
    }

    const status = getStoreStatus(hours);
    const { isOpen, todayHours, currentDay } = status;
    
    // Get tomorrow's day
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const tomorrowIndex = (days.indexOf(currentDay) + 1) % 7;
    const tomorrow = days[tomorrowIndex];
    
    let statusLine = `Open Status: ${isOpen ? 'Open' : 'Closed'}`;
    let reasonLine = '';
    
    if (isOpen) {
        reasonLine = `Reason: We are currently open and will close today at ${todayHours.close}`;
    } else {
        // If we have hours for today and it's before opening time
        if (todayHours && new Date().getHours() < parseInt(todayHours.open.split(':')[0])) {
            reasonLine = `Reason: We are currently closed and will open today at ${todayHours.open}`;
        } else {
            // We're either past closing time or it's a day we're closed
            const nextOpenDay = hours[tomorrow] ? tomorrow : 'tomorrow';
            const openTime = hours[tomorrow] ? hours[tomorrow].open : '17:00';
            reasonLine = `Reason: We are currently closed and will open ${nextOpenDay} at ${openTime}`;
        }
    }
    
    return `${statusLine}\n${reasonLine}`;
}

module.exports = {
    createFAQString,
    formatResponse,
    isStoreOpen,
    getStoreStatus,
    createOpenStatusString
};