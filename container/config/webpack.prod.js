const { merge } = require('webpack-merge')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const commonConfig = require("./webpack.common");
const packageJson = require("../package.json");

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
  mode: "production",
  output: {
    // specify how we are going to name the files
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        // This is where our marketing front end is hosted
        marketing: `marketing@${domain}`
      },
      shared: packageJson.dependencies
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
