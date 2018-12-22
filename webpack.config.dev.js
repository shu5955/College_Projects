var path = require('path');
var webpack = require('webpack');
// This is the conf file for faster development and debugging
var config = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        './app.js', // the entry point of the application
        'webpack-hot-middleware/client'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
            new webpack.HotModuleReplacementPlugin(),

        new webpack.NoEmitOnErrorsPlugin()
    ],
      module: {
        loaders: [//load babel loader so the app understands react code
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
    test: /\.css$/, 
    loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
},
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: 'file',

            }
        ]
    }
};

module.exports = config;