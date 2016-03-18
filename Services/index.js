module.exports = {
	// Domain services - write side:
	createAuction: require('./createAuction'),
	openAuction: require('./openAuction'),
	placeOffer: require('./placeOffer'),
	// Reporting store services - read (projection) side:
	getAuction: require('./getAuction')
};
