'use strict';

var LOWER = /[a-z]/
, UPPER = /[A-Z]/
, DIGIT = /[0-9]/
, DIGITS = /[0-9].*[0-9]/
, SPECIAL = /[^a-zA-Z0-9]/
, SAME = /^(.)\1+$/;


/**
 *
 * @param {String} str
 * @returns {string}
 */
function uncapitalize(str) {
	return str.substring(0, 1).toLowerCase() + str.substring(1);
}


/**
 *
 * @param {Object} options
 * @returns {Strumph}
 */
function strumph (options) {
	return new Strumph(options);
}


strumph.defaults = {
	template: '<div class="strumph-meter"><div class="strumph-meter-message">&nbsp;</div><div class="strumph-meter-bg"><div class="strumph-meter-bar"></div></div></div>'
	, meter: '.strumph-meter'
	, message: '.strumph-meter-message'
	, target: '.password-strumph'
	, minLength: 6
	, messages: {
		'too-short': 'Too short',
		'very-weak': 'Very weak',
		'weak': 'Weak',
		'good': 'Good',
		'strong': 'Strong'
	}
};


/**
 *
 * @param opts
 * @constructor
 */
function Strumph(opts) {
	this.$input = $(opts.input);

	if (! this.$input) {
		throw 'Missing "input"';
	}

	var options = $.extend({}, strumph.defaults, opts);
	var $target = $(options.target).html(options.template);

	this.$meter = $(options.meter, $target);
	this.$message = $(options.message, $target);
	this.messages = options.messages;
	this.settings = options;
	this.bind();
}


/**
 *
 *
 * @param {String} password
 * @returns {Boolean}
 */
Strumph.prototype.checkPassword = function (password) {
	var rating = this.rate(password);

	this.updateMeter(rating);
	return rating.rate > 2;
};


/**
 *
 *
 * @returns {jQuery}
 */
Strumph.prototype.bind = function () {
	var self = this;

	return this.$input.keyup(function (event) {
		self.checkPassword(event.target.value);
	});
};


/**
 *
 * @param {rating} rating
 */
Strumph.prototype.updateMeter = function (rating) {
	this.$meter.removeClass()
		.addClass('strumph-meter')
		.addClass('strumph-meter-' + rating.messageKey);

	this.$message.text(this.messages[rating.messageKey]);
};


/**
 *
 * @param rate
 * @param message
 * @returns {{rate: Number, messageKey: String}}
 */
Strumph.prototype.rating = function (rate, message) {
	return {
		rate: rate
		, messageKey: message
	};
};


/**
 *
 *
 * @param password
 * @returns {rating}
 */
Strumph.prototype.rate = function (password) {
	if (!password || password.length < this.settings.minLength) {
		return this.rating(0, 'too-short');
	}

	if (SAME.test(password)) {
		return this.rating(1, 'very-weak');
	}

	var lower = LOWER.test(password)
	, upper = UPPER.test(uncapitalize(password))
	, digit = DIGIT.test(password)
	, digits = DIGITS.test(password)
	, special = SPECIAL.test(password);

	if (lower && upper && digit || lower && digits || upper && digits || special) {
		return this.rating(4, 'strong');
	}

	if (lower && upper || lower && digit || upper && digit) {
		return this.rating(3, 'good');
	}

	return this.rating(2, 'weak');
};
