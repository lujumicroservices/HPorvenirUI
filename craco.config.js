
module.exports = {
	style: {
		postcss: {
			plugins: [require('tailwindcss'), require('autoprefixer')]
		}
	},
	webpack: {        
        configure: { 
			devServer: {		
				disableHostCheck: true,														
				hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
				host: '0.0.0.0',
				https: false, // true for self-signed, object for cert authority
				noInfo: true, // only errors & warns on hot reload
				port: 8080
				
			  }
			
		 }
        
    }
};
