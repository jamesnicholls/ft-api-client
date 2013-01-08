Sample usage for the ftApi node client
======================================
To find out how to use the FT content API got to <https://developer.ft.com>


Fetching a list of updated items from a specific point in time
-------------
This example will return a list of IDs

	var ftApi = require('ft-api-client'),
		apiKey = "XXXXXXXX";

	// Fetch a list of the latest notifications form the CAPI
	function getNotifications () {
		"use strict";
		var config = {}, // Config to be used when the request is made
			initConfig = {}, // Config to be used when the object is initialised
			notificationsFetcher;


		// Config can be set when a new GetChangesFromCapi object is created or when the request is made
		// The 'apiKey' and the 'since' date are required.
		initConfig.apiKey					= apiKey; // Required, your API key
		//initConfig.aggregateResponse		= true; Optional, set by default: Combine all the responses into an array and return them when 'loadComplete' fires
		//initConfig.apiDomain				= 'api.ft.com'; // Optional, set by default: The domain for the CAPI
		//initConfig.itemNotificationsPath	= '/content/notifications/v1/items'; // Optional, set by default
		//initConfig.apiUpdateDelay			= 125; // Optional, set by default: Time in ms between requests, used to control the speed of comms to the API
		//config.limit						= 20; // Optional, set by default: The number of items returned per request

		notificationsFetcher = new ftApi.notifications.GetChangesFromCapi(initConfig);

		// The since date is required, should be in ISO format
		config.since = '2012-12-19T13:00:00z'; // Required

		// Get a list of modified articles from the CAPI
		notificationsFetcher.fetchItems(config);

		// A 'notificationsRequestComplete' event is fired after each request to the API
		notificationsFetcher.on('notificationsRequestComplete', function (notifications) {
			console.log('Notifcations request complete');
		});

		// When all requests have complete a 'loadComplete' is fired
		notificationsFetcher.on('loadComplete', function (aggregatedResponse) {
			// aggregateResponse = {
			//	resultsList: [] A list of objects where each object is a reso=ponse object form the CAPI
			//	totalResults: Int: The number of results, there may be a mismatch
			// }
			console.log(aggregatedResponse.resultsList.length, "of", aggregatedResponse.totalResults);

			// Flatten the list of notifcations returned from the API using the helper method from apiUtils
			var requestList = ftApi.utils.flattenNotificationsResponse(aggregatedResponse.resultsList);
			console.log(aggregatedResponse);
			getApiData(requestList);
		});

		// A request error of any sort emit a 'requestError' event
		notificationsFetcher.on('requestError', function (request) {
			console.log(request);
		});

	}
	getNotifications();

Fetching the data for *n* number of content IDs
-------------
This example will return the full data for each ID specfied

	var ftApi = require('ft-api-client'),
		apiKey = "XXXXXXXX";

	function getApiData (itemsList) {
		"use strict";
		var config = {},
			dataFetcher;

		// The only required config is the apiKey
		config.apiKey = apiKey;

		// Optionally:
		//config.aggregateResponse		= true; Optional, set true by default: Combine all the response and return them when 'loadComplete' fires
		//config.apiDomain				= 'api.ft.com'; // Optional, set by default: The domain for the CAPI
		//config.apiItemPath			= '/content/notifications/v1/items'; // Optional, set by default
		//config.apiUpdateDelay			= 125; // Optional, set by default: Time in ms between requests, used to control the speed of comms to the API

		// Create a new GetDataFromContentApi object and pass in any required config
		dataFetcher = new ftApi.content.GetDataFromContentApi(config);

		// Request the content from the API. Content is fetched synchronously and throttled using the apiUpdateDelay property of config.
		// Pass an array of IDs
		dataFetcher.getApiContent(itemsList);

		// An 'itemLoadComplete' event will fire after each item is successfully loaded
		dataFetcher.on('itemLoadComplete', function (data) {
			console.log('Individual request complete');
		});

		// A load complete event will fire when all content is loaded.
		dataFetcher.on('loadComplete', function (responseData) {
			// Returns a list of response CAPI response items
			console.log(responseData);
		});
	}

Fetching a list FT pages and fetching the data for an individual page
-------------

	var ftApi = require('ft-api-client'),
		apiKey = "XXXXXXXX";

	function getFtPages () {
		"use strict";
		var config = {}; // Config to be used when the request is made
		
		config.apiKey						= apiKey; // Required, your API key
		//initConfig.apiDomain				= 'api.ft.com'; // Optional, set by default: The domain for the CAPI
		//initConfig.pagePath				= '/site/v1/pages/'; // Optional, set by default

		// Create a pages object, only the API key is required
		var ftPages = new ftApi.pages.GetPagesFromContentApi(config);
		ftPages.getPages();

		// When fetching the list of pages a 'pageListLoadComplete' will fire
		ftPages.on('pageListLoadComplete', function (pageList) {
			console.log('Page list:', pageList);
			//UK homepage 4c499f12-4e94-11de-8d4c-00144feabdc0
			ftPages.getPage('4c499f12-4e94-11de-8d4c-00144feabdc0');
		});

		// When fetching a single page a 'pageLoadComplete'
		ftPages.on('pageLoadComplete', function (page) {
			console.log('UK Homepage', page);
		});

	}