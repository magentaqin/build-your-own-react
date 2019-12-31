
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const myReact = path.join(__dirname, './react/src');

module.exports = {
  context: path.resolve(__dirname, './demo'),
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, './demo/dist'),
    publicPath: '/'
  },
  resolve: {
    alias: {
      'my-react': myReact,
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          sourceMap: true,
          presets: [
            ["@babel/preset-typescript", { jsxPragma: 'h'}], // add support for TS.
            [
              "@babel/preset-env", // add support for latest JS.
              {
                modules: false, // disable transformation of ES6 module syntax to another module type.
                loose: true, // https://2ality.com/2015/12/babel6-loose-mode.html
                targets: {
                  browsers: ['last 2 versions', 'IE >= 9']
                }
              }
            ],
            ["@babel/preset-react"], // add support for jsx and react display name
          ],
          plugins: [
            // ['@babel/plugin-transform-runtime'], // reuse babel injected helper https://babeljs.io/docs/en/babel-plugin-transform-runtime#technical-details
            [
							'@babel/plugin-transform-react-jsx',
							{ pragma: 'h', pragmaFrag: 'Fragment' }
						],
            ['@babel/plugin-proposal-class-properties', { loose: true }], // add support for class properties
            ['@babel/plugin-syntax-dynamic-import'],
          ],
        },
      },
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './demo/public/index.html')
    })
  ]
}