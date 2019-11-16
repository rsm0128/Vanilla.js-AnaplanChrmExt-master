const {
  CheckerPlugin
} = require('awesome-typescript-loader');
const {
  join
} = require('path');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    content: join(__dirname, 'src/content.ts'),
    popup: join(__dirname, 'src/popup.ts'),
    background: join(__dirname, 'src/background.ts'),
  },
  output: {
    path: join(__dirname, '../angular/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.ts?$/,
      use: 'awesome-typescript-loader?{configFileName: "chrome/tsconfig.json"}'
    }]
  },
  plugins: [
    new CheckerPlugin(),
    new CopyPlugin([{
      from: join(__dirname, 'src/popup.html'),
      to: join(__dirname, '../angular/dist/popup.html')
    }, {
      from: join(__dirname, 'src/bootstrap.min.css'),
      to: join(__dirname, '../angular/dist/bootstrap.min.css')
    }, {
      from: join(__dirname, 'src/custom.css'),
      to: join(__dirname, '../angular/dist/custom.css')
    }, {
      from: join(__dirname, 'src/material-dashboard.min.css'),
      to: join(__dirname, '../angular/dist/material-dashboard.min.css')
    }, {
      from: join(__dirname, 'src/jquery.min.js'),
      to: join(__dirname, '../angular/dist/jquery.min.js')
    }, {
      from: join(__dirname, 'src/popper.min.js'),
      to: join(__dirname, '../angular/dist/popper.min.js')
    }, {
      from: join(__dirname, 'src/bootstrap.min.js'),
      to: join(__dirname, '../angular/dist/bootstrap.min.js')
    }, {
      from: join(__dirname, 'src/anaplan.js'),
      to: join(__dirname, '../angular/dist/anaplan.js')
    }])
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};