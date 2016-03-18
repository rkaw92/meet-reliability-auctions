var Auction = require('../Entities/Auction');

/**
 * Place an offer in an auction.
 * @param {Object} deps - The run-time dependencies, supplied by a service container.
 * @param {Object} params - Caller-provided parameters.
 * @param {string} params.ID - A universally-unique ID of the auction to take part in.
 * @param {string} params.buyer - ID of the user that is taking part in the auction.
 * @param {number} params.amount - The amount to offer for the item being sold.
 * @returns {Promise}
 */
module.exports = function openAuction(deps, params) {
	return deps.repository.invoke(Auction, params.ID, function(auctionInstance) {
		auctionInstance.placeOffer(params.buyer, params.amount, new Date());
	});
};
