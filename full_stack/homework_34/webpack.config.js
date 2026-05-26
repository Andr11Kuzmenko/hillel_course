const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (_env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: { main: './src/index.js' },

    output: {
      path: path.resolve(__dirname, 'dist'),
      // (1) Content hashing — new hash whenever a chunk's contents change,
      //     so the browser's long-term cache is invalidated only when needed.
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext][query]',
      clean: true,
      publicPath: '',
    },

    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',

    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 3000,
      hot: true,
      open: false,
    },

    module: {
      rules: [
        // (4) CSS / SCSS integration — extracted to a hashed .css file in
        //     production, injected via <style> in dev for HMR.
        {
          test: /\.(scss|css)$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },

        // (3) Images — small files (< 4 KiB) inlined as data URLs,
        //     larger ones emitted to dist/images with a content hash.
        {
          test: /\.(png|jpe?g|gif|webp|svg)$/i,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 4 * 1024 } },
          generator: { filename: 'images/[name].[contenthash:8][ext]' },
        },

        // (2) Local fonts — bundled from node_modules (@fontsource/inter)
        //     into dist/fonts with a content hash for long-term caching.
        {
          test: /\.(woff2?|ttf|otf|eot)$/i,
          type: 'asset/resource',
          generator: { filename: 'fonts/[name].[contenthash:8][ext]' },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: isProd,
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: 'css/[name].[contenthash:8].css',
            }),
          ]
        : []),
    ],

    optimization: {
      minimize: isProd,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      // (5) Optimised external libraries — vendor code goes into its own
      //     long-cacheable chunk, and `runtimeChunk` keeps the manifest
      //     separate so app-only changes don't bust the vendor hash.
      //     Combined with per-function imports (e.g. `lodash-es/debounce`)
      //     and Terser, this keeps the bundle minimal.
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
};
