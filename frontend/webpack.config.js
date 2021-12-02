const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const prod = process.env.NODE_ENV === 'development';

module.exports = {
  devtool: "source-map",
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "bundle.[fullhash].js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),      
      "process.env.API_URL": prod ? JSON.stringify("https://rewaer.com"): JSON.stringify("http://localhost:5000"),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
    }),
  ],
  resolve: {
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ["file-loader", "image-webpack-loader"],
      },
    ],
  },
};
