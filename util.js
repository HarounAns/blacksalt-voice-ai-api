
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


module.exports = {
    createFAQString,
    formatResponse
};