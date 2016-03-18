'use strict';

const ws = require('ws');
const when = require('when');

module.exports = function() {
	this.requires('webServer');
	this.requires('serviceContainer');
	this.provides('socketInterface', function(resources) {
		var services = resources.serviceContainer;
		// Create a WebSocket server and bind it to the HTTP server:
		var socketServer = new ws.Server({ server: resources.webServer });
		
		// Whenever a client connects:
		socketServer.on('connection', function(client) {
			// Register a message handler on the client object:
			client.on('message', function(message) {
				// Messages are assumed to be JSON-RPC 2.0 Request objects:
				var request = {};
				return when.try(function() {
					request = JSON.parse(message);
					console.log('request:', request);
					var service = services.service(request.method);
					return service(request.params, client).then(function(result) {
						return { result: result || null };
					});
				}).catch(function(error) {
					return {
						error: {
							code: error.code || error.name,
							message: error.message,
							data: error.data,
							stack: error.stack
						}
					};
				}).then(function(response) {
					// Send a message (JSON-RPC 2.0 Reply) containing either a result or an error.
					// We actually stringify both, but since one of them must be undefined,
					//  only the other will end up in the resulting JSON string.
					console.log('response:', response);
					client.send(JSON.stringify({
						jsonrpc: '2.0',
						id: request.id,
						result: response.result,
						error: response.error
					}));
				});
			});
		});
	});
};
