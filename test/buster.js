var config = module.exports;

config['development'] = {
	env: 'browser'
	, rootPath: '../'
	, deps: [
		'components/jquery/jquery.js'
	]
	, sources: ['src/js/strumph.js']
	, specs: ['test/spec/**/*.js']
};