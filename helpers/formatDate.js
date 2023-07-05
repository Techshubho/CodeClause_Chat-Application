// helper/formatDate.js
const { DateTime } = require('luxon');

function formatMessage(username, text) {
  const currentTime = DateTime.local().toFormat('h:mm a');
  const formattedTime = `<span style="color:gray">${currentTime}</span>`;
  return {
    username,
    text,
    time: formattedTime
  };
}

module.exports = formatMessage;
