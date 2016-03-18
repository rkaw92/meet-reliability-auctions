'use strict';

var EventProjector = require('esdf-memory-projector').EventProjector;

function Auctions() {
	var projector = new EventProjector('Auction');
	projector.addHandler('AuctionCreated', function(state, event) {
		return {
			name: event.eventPayload.name,
			description: event.eventPayload.description,
			seller: event.eventPayload.seller,
			creationDate: event.eventPayload.creationDate,
			openingDate: event.eventPayload.openingDate,
			opened: false,
			offer: null
		};
	});
	projector.addHandler('AuctionOpened', function(state, event) {
		return {
			name: state.name,
			description: state.description,
			seller: state.seller,
			creationDate: state.creationDate,
			openingDate: state.openingDate,
			opened: true,
			offer: state.offer
		};
	});
	projector.addHandler('AuctionOfferPlaced', function(state, event) {
		console.log('->> AuctionOfferPlaced handler');
		return {
			name: state.name,
			description: state.description,
			seller: state.seller,
			creationDate: state.creationDate,
			openingDate: state.openingDate,
			opened: true,
			offer: event.eventPayload.offer
		};
	});
	return projector;
}
module.exports = Auctions;
