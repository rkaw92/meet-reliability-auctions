'use strict';

const redis = require('redis');
const RedisEventSink = require('esdf-store-redis').RedisEventSink;

module.exports = function() {
	this.requires('config');
	this.provides('eventSink', function(resources) {
		var config = resources.config;
		// Construct a redis client:
		var redisClient = redis.createClient({
			// Since we already wait for the connection, there is no point in queueing commands before connecting:
			enable_offline_queue: false,
			url: config.redis.url || null
		});
		// Once the client is ready, pass it to the sink constructor.
		// Since a Promise can either resolve or reject, but not both, having both event listeners is safe. Whichever occurs first wins.
		return new Promise(function(fulfill, reject) {
			redisClient.once('connect', function() {
				// The promise yields a RedisEventSink, which can be used as the application's interface for writing to and reading from the EventStore.
				fulfill(new RedisEventSink(redisClient));
			});
			redisClient.once('error', function(error) {
				reject(error);
			});
		});
	});
};
