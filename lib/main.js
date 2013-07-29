var ValidationError = require('custom-errors').general.ValidationError;

function isFunction (functionToCheck) {
	var getType = {};
	return (functionToCheck && getType.toString.call(functionToCheck) === '[object Function]');
}

function isObject (item) {
	return (item && item.constructor === Object.prototype.constructor);
};

/**
 * Abstract Factory
 *
 * @class AbstractFactory
 * @constructor
 *
 * @param  {Object} factories 	Hash of factories to store in the registry.
 * @property {Object} factories Hash of factories passed in as argument to constructor
 * @throws {ValidationError} 	If factories is not an object
 */

var AbstractFactory = function (factories) {

	// if (!isObject(factories)) {
	if (typeof factories !== 'object') {
		throw new ValidationError('not valid map of objects');
	}

	/** @property factories {Object} Hash of factories passed in as argument to constructor */
	this.factories = factories;
};

/**
 * Get a factory from the registry.
 * @method
 * @param  {String} [type=Default] Name of factory you want to return; defaults to Default factory.
 * @param  {Object} [initOpts] Params to pass to the factory if being instantiated with new, eg new Factory (initOps).
 * @throws {ValidationError} If type of factory is not found in registry and no default is set
 * @return {Class} The factory requested from the registry.
 */
AbstractFactory.prototype.getFactory = function (type, initOpts) {

	var Factory = this.factories[type] || this.factories['Default'];

	if (Factory === undefined) {
		throw new ValidationError('no factory requested and no default set');
	}

	return (isFunction(Factory)) ? new Factory(initOpts) : Factory;
};


/**
 * Exports AbstractFactory Class
 *
 * @type {AbstractFactory}
 */
module.exports = AbstractFactory;