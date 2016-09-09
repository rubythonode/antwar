/* eslint-disable no-console */
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('../config/dev');

module.exports = function (config) {
  const devConfigParams = {
    entry: {
      main: [
        path.join(__dirname, './dev_entry.js')
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ],
    devtool: 'eval',
    debug: true
  };

  return devConfig(config).then(function (c) {
    runServer(config.antwar, merge(c, devConfigParams));
  });
};

function runServer(siteConfig, webpackConfig) {
  const port = siteConfig.port;
  const console = siteConfig.console;

  new WebpackDevServer(webpack(webpackConfig), {
    contentBase: path.join(process.cwd(), './.antwar/build'),
    hot: true,
    historyApiFallback: true,
    inline: true,
    stats: 'errors-only'
  }).listen(port, function (err) {
    if (err) {
      return console.error(err);
    }

    return console.info('Listening at port ' + port);
  });
}