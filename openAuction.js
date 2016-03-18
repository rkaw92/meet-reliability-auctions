var esdf = require('esdf');
var when = require('when');
var Repository = esdf.utils.Repository;
var Auction = require('./Entities/Auction');
var redis = require('redis');
var RedisEventSink = require('esdf-store-redis').RedisEventSink;

var client = redis.createClient();
var sink = new RedisEventSink(client);
var loaderFunction = esdf.utils.createAggregateLoader(sink);

var repo = new Repository(loaderFunction);

const dayMS = 86400000;

repo.invoke(Auction, 'AUCTION-1', function(auction) {
	auction.open(new Date(Date.now() + dayMS));
	return when.resolve().delay(5000);
}).done(function() {
	console.log('Auction opened!');
});
