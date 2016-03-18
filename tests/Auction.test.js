'use strict';

var assert = require('assert');
var Auction = require('../Entities/Auction');
const dayMS = 86400000;

describe('Auction', function() {
	describe('#create', function() {
		it('should create the auction and assign a name to it', function() {
			var myAuction = new Auction();
			myAuction.create('Obraz autorski', '...albo bazgroły, kto tam wie?', 'user1', new Date(), new Date(Date.now() + dayMS));
			assert(myAuction.isCreated());
			assert.equal(myAuction.getName(), 'Obraz autorski');
		});
		it('should deduplicate multiple creation attempts', function() {
			var myAuction = new Auction();
			myAuction.create('Obraz autorski', '...albo bazgroły, kto tam wie?', 'user1', new Date(), new Date(Date.now() + dayMS));
			var startEventCount = myAuction.getStagedEvents().length;
			myAuction.create('Obraz autorski', '...albo bazgroły, kto tam wie?', 'user1', new Date(), new Date(Date.now() + dayMS));
			var finalEventCount = myAuction.getStagedEvents().length;
			assert.equal(startEventCount, finalEventCount);
		});
	});
	describe('#open', function() {
		it('should open the auction for offers', function() {
			var myAuction = new Auction();
			myAuction.create('Obraz autorski', '...albo bazgroły, kto tam wie?', 'user1', new Date('2016-01-01'), new Date('2016-01-07'));
			myAuction.open(new Date('2016-01-07'));
			assert(myAuction.isOpened());
		});
	});
});
