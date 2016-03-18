'use strict';

class Offer {
	constructor(buyer, amount, date) {
		this.buyer = buyer;
		this.amount = amount;
		this.date = new Date(date);
	}
	
	static unflatten(flatOffer) {
		return new Offer(
			flatOffer.buyer,
			flatOffer.amount,
			flatOffer.date
		);
	}
}

module.exports = Offer;
