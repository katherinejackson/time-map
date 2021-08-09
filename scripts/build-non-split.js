const rewire = require('rewire')
const defaults = rewire('react-scripts/scripts/build.js')
let config = defaults.__get__('config')

config.optimization.splitChunks = {
	cacheGroups: {
		default: false
	}
}

config.optimization.runtimeChunk = false

config.output.filename = 'static/js/timemap.js'

// // Renames main.b100e6da.css to main.css
// config.plugins[5].options.filename = 'static/css/timemap.css'
// config.plugins[5].options.moduleFilename = () => 'static/css/main.css'