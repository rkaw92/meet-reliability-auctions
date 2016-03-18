var Auction = require('../Entities/Auction');

/**
 * Get the data for an auction.
 * @param {Object} deps - The run-time dependencies, supplied by a service container.
 * @param {Object} params - Caller-provided parameters.
 * @param {string} params.ID - The ID of the auction to open.
 * @param {boolean} params.live - Whether a subscription for further events should be established for the requesting client.
 * @param {Object} socket - A client socket that the service can write to.
 * @returns {Promise}
 */
module.exports = function getAuction(deps, params, socket) {
	var projector = deps.eventProjectors.Auctions;
	var projection = projector.getProjection(params.ID);
	
	// If possible, and the user has requested it, start a subscription to this aggregate's events.
	if (projection && params.live) {
		var subscription = function(event) {
			socket.send(JSON.stringify(event));
		};
		projection.on('event', subscription);
		socket.once('close', function() {
			projection.removeListener('event', subscription);
		});
	}
	
	return Promise.resolve(projection ? projection.state : null);
};
