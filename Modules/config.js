'use strict';

const yaml = require('js-yaml');
const nodefn = require('when/node');
var fs = nodefn.liftAll(require('fs'));

module.exports = function() {
	this.provides('config', function() {
		return fs.readFile(__dirname + '/../Config/config.yaml', 'utf-8').then(function(configText) {
			return yaml.safeLoad(configText);
		});
	});
};
