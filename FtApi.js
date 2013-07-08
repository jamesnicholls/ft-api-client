'use strict';

var ContentModule = require('./lib/getContentApiContent.js'),
    NotificationsModule = require('./lib/getContentItemsNotification.js');

// NB. API Key is not currently passed anywhere.
function FtApi (apiKey) {
  if (typeof apiKey !== 'string' || apiKey === '') {
    throw new TypeError('The FT API constructor requires an API key, ' +
        'which must be a non-empty string');
  }

  this.content = new ContentModule(apiKey);
  this.notifications = new NotificationsModule(apiKey);
}

module.exports = FtApi;
