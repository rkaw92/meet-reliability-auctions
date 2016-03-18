'use strict';

// Require a map of constructor-like functions that return new projector instances.
const projectorCreators = require('../Projectors');
const esdf = require('esdf');

module.exports = function() {
	this.requires('eventReader');
	this.provides('eventProjectors', function(resources) {
		// Projectors are components that accept events and build models in the background.
		// They act much like reducer functions in React's redux.
		var projectors = new Map();
		Object.keys(projectorCreators).forEach(function(projectorName) {
			// Get the projector:
			var projector = projectorCreators[projectorName]();
			// Hook it up to the event reader, so that it starts receiving events and creating projections out of them:
			var projectorQueue = new esdf.utils.WritableQueue(function(commit) {
				return projector.processCommit(commit).catch(function(error) {
					console.error(error ? (error.stack || error) : error);
					throw error;
				});
			}, {
				// Only process one commit at a time - preserve sequential order:
				concurrencyLimit: 1
			});
			//resources.eventReader.on('data', projector.processCommit.bind(projector));
			resources.eventReader.pipe(projectorQueue);
			// Also leave a reference in the map, so that services can refer to the projector and read projections of aggregates.
			projectors[projectorName] = projector;
		});
		
		return projectors;
	});
};
