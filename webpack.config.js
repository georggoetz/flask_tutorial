const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'

  return {
    entry: './flaskr/frontend/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'flaskr/static/dist'),
      publicPath: '/flaskr/static/dist/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(c|sa|sc)ss$/i,
          resourceQuery: /raw/,
          use: ['raw-loader', 'sass-loader']
        },
        {
          test: /\.(c|sa|sc)ss$/i,
          resourceQuery: { not: [/raw/] },
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [path.resolve(__dirname, 'flaskr/frontend/scss')]
                }
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8
      })
    ],
    devtool: isDev ? 'inline-source-map' : false,
    devServer: {
      static: {
        directory: path.join(__dirname, 'static')
      },
      hot: true,
      port: 3000,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    mode: isDev ? 'development' : 'production'
  }
}