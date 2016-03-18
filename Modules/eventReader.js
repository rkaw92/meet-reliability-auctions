'use strict';

const redis = require('redis');
const RedisEventReader = require('esdf-store-redis').RedisEventReader;
const when = require('when');

function connect(redisURL) {
	var redisClient = redis.createClient({
		// Since we already wait for the connection, there is no point in queueing commands before connecting:
		enable_offline_queue: false,
		url: redisURL
	});
	return new Promise(function(fulfill, reject) {
		redisClient.once('ready', function() {
			// The promise yields a RedisEventSink, which can be used as the application's interface for writing to and reading from the EventStore.
			fulfill(redisClient);
		});
		redisClient.once('error', function(error) {
			reject(error);
		});
	});
}

module.exports = function() {
	this.requires('config');
	this.provides('eventReader', function(resources) {
		var config = resources.config;
		// Construct the two required redis clients.
		// The "read" client is the connection responsible for getting data from the DB.
		var readClientPromise = connect(config.redis.url);
		// The "subscriber" reserves an entire connection for listening to PUBLISHed messages.
		var subscriberClientPromise = connect(config.redis.url);
		// Wait for both clients to connect:
		return when.all([ readClientPromise, subscriberClientPromise ]).then(function(clients) {
			// Pass the read client and the subscriber client to the reader:
			return new RedisEventReader(clients[0], clients[1]);
		});
	});
};
