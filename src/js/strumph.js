/**
 * Taken from jQuery validate.password plug-in 1.0
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

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
	var _strumph
		, $el = $(options.el);

	if (! $el) {
		throw 'Missing "el"'
	}

	_strumph = new Strumph(options);
	$el.keyup(function (event) {
		_strumph.checkPassword(event.target.value);
	});

	return _strumph;
}


/**
 *
 * @param opts
 * @constructor
 */
function Strumph(opts) {
	var options = $.extend({}, Strumph.defaults, opts);

	$(options.target).html(options.template);

	this.$meter = options.$meter;
	this.messages = options.messages;
	this.username = options.username;
	this.$message = $(options.message, this.$meter);
}


Strumph.defaults = {
	template: '<div class="password-strumph"><div class="password-meter-message"></div><div class="password-meter-bar"></div></div>'
	, message: '.password-meter-message'
	, messages: {
		'similar-to-username': 'Too similar to username',
		'too-short': 'Too short',
		'very-weak': 'Very weak',
		'weak': 'Weak',
		'good': 'Good',
		'strong': 'Strong'
	}
};


/**
 *
 *
 * @param {String} password
 * @returns {Boolean}
 */
Strumph.prototype.checkPassword = function (password) {
	var rating = this.rate(password, this.username);

	this.updateMeter(rating);
	return rating.rate > 2;
};


/**
 *
 * @param {rating} rating
 */
Strumph.prototype.updateMeter = function (rating) {
	var $meter = this.$meter;

	$('.password-meter-bar', $meter).removeClass()
		.addClass('password-meter-bar')
		.addClass('password-meter-' + rating.messageKey);

	$('.password-meter-message', $meter).removeClass()
		.addClass('password-meter-message')
		.addClass('password-meter-message-' + rating.messageKey)
		.text(this.messages[rating.messageKey]);
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
 * @param username
 * @returns {rating}
 */
Strumph.prototype.rate = function (password, username) {
	if (!password || password.length < 8) {
		return this.rating(0, 'too-short');
	}

	if (username && password.toLowerCase().match(username.toLowerCase())) {
		return this.rating(0, 'similar-to-username');
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
