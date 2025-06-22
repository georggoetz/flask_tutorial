const path = require('path');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './flaskr/webpack/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'flaskr/static/dist'),
      publicPath: '/flaskr/static/dist/',
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]',
          },
        },
      ],
    },
    devtool: isDev ? 'inline-source-map' : false,
    devServer: {
      static: {
        directory: path.join(__dirname, 'static'),
      },
      hot: true,
      port: 3000,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    mode: isDev ? 'development' : 'production',
  };
};