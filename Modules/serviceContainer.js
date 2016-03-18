'use strict';

const ServiceContainer = require('esdf').services.ServiceContainer;
const services = require('../Services');

module.exports = function() {
	this.requires('repository');
	this.requires('eventProjectors');
	this.provides('serviceContainer', function(resources) {
		// Construct a service container, which is going to contain services bound to resources / dependencies:
		var container = new ServiceContainer();
		// Add some run-time dependencies required by our services:
		container.addResource('repository', resources.repository);
		container.addResource('eventProjectors', resources.eventProjectors);
		// Add the service functions - these are going to be the entry points for users' RPC calls:
		Object.keys(services).forEach(function(serviceName) {
			container.addService(serviceName, services[serviceName]);
		});
		
		// The value provided by this composition module is the service container:
		return container;
	});
};
