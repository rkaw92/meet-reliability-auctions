const CompositionManager = require('app-compositor').CompositionManager;

// ### Modules ###
const compositionModules = require('./Modules');

// ### Application initialization ###

const initStart = Date.now();
const manager = new CompositionManager();
manager.runModules(compositionModules).done(function(modules) {
	console.log('>> Application started successfully (in %d ms)!', Date.now() - initStart);
}, function(error) {
	console.error('[ERR] Application failed to initialize: %s', error);
	process.exit(error.code || 55);
});
