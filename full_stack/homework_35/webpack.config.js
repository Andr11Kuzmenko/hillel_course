const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const analyze = Boolean(env && env.analyze);

  return {
    entry: { main: './src/index.ts' },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext][query]',
      clean: true,
      publicPath: '',
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.mjs'],
    },

    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',

    // (1) DevServer with hot reload + live-reload fallback.
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 3000,
      hot: true,
      liveReload: true,
      open: false,
    },

    module: {
      rules: [
        // (5) Babel — transpiles modern JS to the browserslist target.
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },

        // (4) TypeScript — type-checks and compiles .ts/.tsx via ts-loader.
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },

        // (2) External CSS + (3) SCSS preprocessor.
        {
          test: /\.(scss|css)$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },

        // (3) LESS preprocessor.
        {
          test: /\.less$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'less-loader',
          ],
        },

        // Images — small ones inlined, larger emitted to dist/images.
        {
          test: /\.(png|jpe?g|gif|webp|svg)$/i,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 4 * 1024 } },
          generator: { filename: 'images/[name].[contenthash:8][ext]' },
        },

        // Local fonts (from @fontsource).
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

      // (6) ESLint — runs against source on every build, using flat config.
      new ESLintPlugin({
        extensions: ['js', 'mjs', 'ts', 'tsx'],
        configType: 'flat',
        failOnError: isProd,
      }),

      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: 'css/[name].[contenthash:8].css',
            }),
          ]
        : []),

      // (7) Bundle Analyzer — opt-in via `npm run analyze`. Writes
      //     bundle-report.html next to the config; does not auto-open.
      ...(analyze
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: false,
              reportFilename: path.resolve(__dirname, 'bundle-report.html'),
            }),
          ]
        : []),
    ],

    optimization: {
      minimize: isProd,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
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
