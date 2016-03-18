'use strict';

const createAggregateLoader = require('esdf').utils.createAggregateLoader;
const Repository = require('esdf').utils.Repository;

module.exports = function() {
	this.requires('eventSink');
	this.provides('repository', function(resources) {
		// First, we need to create an "aggregate loader" - a function which knows how to rehydrate an Aggregate Root from events.
		var loader = createAggregateLoader(resources.eventSink);
		// Next, the loader can be passed into a repository.
		var repository = new Repository(loader);
		
		return repository;
	});
};
