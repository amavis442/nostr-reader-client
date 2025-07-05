// rollup.config.js
export default {
	// ...
	output: {
		file: 'bundle.js',
		format: 'iife',
		name: 'MyBundle'
	}
};

// var MyBundle = (function () {...