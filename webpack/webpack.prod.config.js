/* eslint @typescript-eslint/no-var-requires: "off" */
const merge = require('webpack-merge');

const common = require('./webpack.config.js');

module.exports = merge.mergeWithCustomize({
  customizeArray: merge.customizeArray({
    plugins: 'prepend',
  }),
})(common, {
  plugins: [...common.plugins],
  mode: 'production',
  devtool: false,
});
