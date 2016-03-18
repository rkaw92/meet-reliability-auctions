var Auction = require('../Entities/Auction');

/**
 * Create an auction by describing the item on sale and prepare it for opening later.
 * @param {Object} deps - The run-time dependencies, supplied by a service container.
 * @param {Object} params - Caller-provided parameters.
 * @param {string} params.ID - A universally-unique ID of the auction to create.
 * @param {string} params.name - The title of the auction, displayed to potential bidders.
 * @param {string} params.description - A textual description of the item.
 * @param {string} params.seller - ID of the selling user.
 * @param {string} params.openingDate - The earliest date at which the seller is going to open the auction.
 */
module.exports = function createAuction(deps, params) {
	return deps.repository.invoke(Auction, params.ID, function(auctionInstance) {
		auctionInstance.create(params.name, params.description, params.seller, new Date(), params.openingDate);
	});
};
