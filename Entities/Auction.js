'use strict';

const esdf = require('esdf');
var Event = esdf.core.Event;
var EventSourcedAggregate = esdf.core.EventSourcedAggregate;
var Offer = require('../Types/Offer');

class Auction extends EventSourcedAggregate {
	constructor() {
		super();
		this._aggregateType = 'Auction';
		this._created = false;
		this._opened = false;
		this._name = null;
		this._description = null;
		this._seller = null;
		this._offers = [];
		this._creationDate = null;
		this._openingDate = null;
	}
	
	// ### Operations ###
	
	create(name, description, seller, creationDate, openingDate) {
		// Guard clause: ensure parameter validity.
		if (!name || !description || !seller || !creationDate || !openingDate) {
			throw new Error('Missing parameters for Auction#create');
		}
		
		// Guard clause: deduplicate the creation operation.
		if (this._created) {
			return;
		}
		
		this._stageEvent(new Event('AuctionCreated', {
			name,
			description,
			seller,
			creationDate,
			openingDate
		}));
	}
	
	open(actualOpeningDate) {
		if (!actualOpeningDate) {
			throw new Error('Missing parameters for Auction#open');
		}
		
		if (!this._created) {
			throw new Error('The auction needs to be created (planned) before it can be opened for bidding');
		}
		
		if (actualOpeningDate.getTime() < this._openingDate.getTime()) {
			throw new Error('It is too early for this auction to be opened');
		} 
		
		if (this._opened) {
			return;
		}
		
		this._stageEvent(new Event('AuctionOpened', {
			actualOpeningDate
		}))
	}
	
	placeOffer(buyer, amount, date) {
		var offerToPlace = new Offer(buyer, amount, date);
		
		if (!this._opened) {
			throw new Error('The auction is not open for offers at this time');
		}
		
		// Check if the buyer has already offered this amount. If so, there is no point in letting them offer it again.
		if (this._offers.some(function(placedOffer) {
			return placedOffer.buyer === offerToPlace.buyer && placedOffer.amount === offerToPlace.amount;
		})) {
			return;
		}
		
		// Offers' amount need to increase in time - it would be pointless to place non-winning offers.
		if (this._offers.some(function(existingOffer) {
			return existingOffer.amount >= offerToPlace.amount;
		})) {
			throw new Error('Your offer is not the highest');
		}
		
		this._stageEvent(new Event('AuctionOfferPlaced', {
			offer: offerToPlace
		}));
	}
	
	// ### Event handlers ###
	
	onAuctionCreated(event) {
		this._created = true;
		this._name = event.eventPayload.name;
		this._description = event.eventPayload.description;
		this._seller = event.eventPayload.seller;
		this._creationDate = new Date(event.eventPayload.creationDate);
		this._openingDate = new Date(event.eventPayload.openingDate);
	}
	
	onAuctionOpened(event) {
		this._opened = true;
	}
	
	onAuctionOfferPlaced(event) {
		var placedOffer = Offer.unflatten(event.eventPayload.offer);
		this._offers.push(placedOffer);
	}
	
	// ### Getters ###
	
	isCreated() {
		return this._created;
	}
	
	isOpened() {
		return this._opened;
	}
	
	getName() {
		return this._name;
	}
}

module.exports = Auction;
