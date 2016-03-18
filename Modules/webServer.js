'use strict';

const http = require('http');
var nodefn = require('when/node');

module.exports = function() {
	this.requires('config');
	this.provides('webServer', function(resources) {
		var config = resources.config;
		// Create an HTTP server:
		var server = http.createServer();
		return nodefn.call(server.listen.bind(server), config.http.port, config.http.host).yield(server);
	});
};
