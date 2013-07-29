/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

// npm modules
var _    = require('underscore'),
	clone = require('clone'),
	test = require('tape').test,
	ValidationError = require('custom-errors').general.ValidationError,
// libs
	AbstractFactory = require('./../lib/main'),
// fixtures
	factoryHashFixture = {
		FactoryOne: {
			getSomething: function (item) {
				return item;
			}
		},
		FactoryTwo: function (initOpts) {
			this.initOpts = initOpts;
			// return (this.initOps = initOps);
		}
	},
	factoryHashFixtureValid = clone(factoryHashFixture);
	factoryHashFixtureValid.Default = factoryHashFixture.FactoryTwo;

test('simple full example for README', function(t) {

	// var AbstractFactory = require('abstract-factory');
	var originalApi = {
			returnData: function () {
				return 'lots of data';
			}
		},
		cheaperApi = {
			returnData: function () {
				return 'less data';
			}
		};

	var App = function (AbFactory) {
		this.myInterface = AbFactory;
	};
	App.prototype.getData = function () {
		// instead of referencing api directly, eg originalApi.returnData();
		return this.myInterface.getFactory('api').returnData();
	};


	// you've just received funding for your great new idea
	// from YCombinator, and you launch your first version, fantastic!
	var MyAppAlpha = new App(new AbstractFactory({
		api: originalApi
	}));

	// oh dear your investors cut the funding suddenly...
	// ...that's okay, all you have to do is swap out a single dependency
	// when instantiating your app; no need to go hunting for methods
	// buried deep in your lib dir
	var MyAppBeta = new App(new AbstractFactory({
		api: cheaperApi
	}));

	t.equal(MyAppAlpha.getData(), 'lots of data', 'alpha app returns correct data from api');
	t.equal(MyAppBeta.getData(), 'less data', 'beta app returns correct data from api');

	t.end();
});


test('module.exports', function(t) {
	t.ok(_.isFunction(AbstractFactory), 'asbtract factory exported and is a function object');
	t.end();
});


test('new Factory(factoryHash) validation', function(t) {
	var AbFab = new AbstractFactory(factoryHashFixtureValid);

	try {
		new AbstractFactory();
	} catch (e) {
		t.ok(e instanceof ValidationError, 'ValidationError class being used for errors');
	}

	t.throws(function () { new AbstractFactory(); }, 'throws if not passed hash of factories');
	// t.throws(function () { new AbstractFactory(factoryHashFixture); }, 'throws if not passed Default in hash of factories');
	t.doesNotThrow(function () { new AbstractFactory(factoryHashFixtureValid); }, 'does not throw if passed in hash of factories');
	t.deepEqual(AbFab.factories, factoryHashFixtureValid, 'correct factory is returned');
	t.end();
});


test('AbstractFactory.prototype.getFactory', function(t) {
	var AbFab = new AbstractFactory(factoryHashFixtureValid),
		initOpts = 'anything',
		FacTwo = AbFab.getFactory('FactoryTwo', initOpts),
		Default = AbFab.getFactory(),
		FacNoDefault = new AbstractFactory({one: 'random'});

	t.equal(FacNoDefault.getFactory('one'), 'random', 'FacNoDefault returns factory that exists');
	t.throws(function () { FacNoDefault.getFactory('doesntExist'); }, 'throws if factory key is not is registry');


	t.deepEqual(AbFab.getFactory('FactoryOne'), factoryHashFixtureValid.FactoryOne, 'correct factory is returned');
	t.ok(FacTwo instanceof factoryHashFixtureValid.FactoryTwo, 'class is instantiated');
	t.ok(Default instanceof factoryHashFixtureValid.Default, 'default class is returned');
	t.equal(FacTwo.initOpts, initOpts, 'class instantiated with opts passed');
	t.end();
});