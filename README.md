# abstract-factory

[![Build Status](https://secure.travis-ci.org/techjacker/abstract-factory.png)](http://travis-ci.org/techjacker/abstract-factory)

## Description
Interface for abstracting classes in your modules; IoC container.

### How does using it help you?
- Make your tests easier
- Cheap dependency injection; no monolothic libs needed


## Install
```Shell
npm install abstract-factory
```


## Full Example

```JavaScript
var AbstractFactory = require('abstract-factory');
var assert = require('assert');


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
// ...that's okay, all you have to do is swap out on dependency
// when instantiating your app; no need to go hunting for methods
// buried deep in your lib dir
var MyAppBeta = new App(new AbstractFactory({
	api: cheaperApi
}));

assert.equal(MyAppAlpha.getData(), 'lots of data', 'alpha app returns correct data from api');
assert.equal(MyAppBeta.getData(), 'less data', 'beta app returns correct data from api');
```