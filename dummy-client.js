var ws = require('ws');
var SocketTransport = require('../WebSocket/esdf-ws-client/lib/SocketTransport')(ws);
var JSONRPC = require('../WebSocket/esdf-ws-client/lib/JSONRPC')();

var transport = new SocketTransport('ws://[::1]:8865');
transport.start();
var RPCClient = new JSONRPC(transport);

transport.on('message', function(message) {
	console.log('message: %s', message);
});

transport.on('connect', function() {
	console.log('connected');
	
// 	RPCClient.call('createAuction', {
// 		ID: 'AUCTION-2',
// 		name: 'The first auction',
// 		description: 'It virtually sells itself.',
// 		seller: 'user1',
// 		openingDate: new Date()
// 	});
	
	RPCClient.call('openAuction', {
		ID: 'AUCTION-2'
	});
	
	RPCClient.call('getAuction', {
		ID: 'AUCTION-2',
		live: true
	});
});

transport.on('error', function() {});
