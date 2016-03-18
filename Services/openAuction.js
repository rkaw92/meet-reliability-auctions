var Auction = require('../Entities/Auction');

/**
 * Open an auction for bidding.
 * @param {Object} deps - The run-time dependencies, supplied by a service container.
 * @param {Object} params - Caller-provided parameters.
 * @param {string} params.ID - A universally-unique ID of the auction to open.
 * @returns {Promise}
 */
module.exports = function openAuction(deps, params) {
	return deps.repository.invoke(Auction, params.ID, function(auctionInstance) {
		auctionInstance.open(new Date());
	});
};
