const { DefinePlugin } = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { getLocalIdent } = require('@dr.pogodin/babel-plugin-react-css-modules/utils');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const smp = new SpeedMeasurePlugin();

const pkg = require('./package.json');
const entryCfg = require('./esbase.config');

const isDev = process.env.NODE_ENV === 'development';
const isSpeed = process.env.SPEED === 'speed';
const isAnalyzer = process.env.Analyzer === 'analyzer';

const getEntry = () => entryCfg.html.reduce((prev, curr) => {
  prev[curr.name] = curr.entry;
  return prev;
}, {});

const getPlugins = () => [
  ...entryCfg.html.map((i) => new HtmlWebpackPlugin({
    inject: 'body',
    chunks: [i.name],
    filename: `${i.name}.html`,
    title: i.title || 'React App',
    template: i.template || 'template/index.html',
    templateParameters: {
      version: pkg.version,
    },
  })),
];

const cfg = {
  entry: getEntry(),
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // 清楚dist下的文件夹
    pathinfo: false,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, 'src'),
            use: [
              {
                loader: 'thread-loader',
                options: {
                  workers: 4,
                  workerParallelJobs: 2,
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                },
              },
            ],
          },
          {
            test: /\.scss$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, 'src/'),
            use: [
              {
                loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
              },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    namedExport: true,
                    localIdentContext: path.resolve(__dirname, 'src'),
                    getLocalIdent,
                    localIdentName: '[name]__[local]__[hash:base64:5]',
                  },
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      'postcss-preset-env',
                    ],
                  },
                },
              },
              {
                loader: 'sass-loader',
              },
            ],
          },
          {
            test: /\.(png|svg|gif|webp|jpe?g)$/,
            exclude: /node_modules/,
            type: 'asset/resource',
            generator: {
              filename: 'images/[name][ext]',
            },
          },
          {
            test: /\.(eot|svg|ttf|woff|)$/,
            exclude: /node_modules/,
            type: 'asset',
            generator: {
              filename: 'assets/[name][ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...getPlugins(),
    new DefinePlugin({
      env: JSON.stringify(process.env.NODE_ENV),
      version: JSON.stringify(pkg.version),
    }),
    new CopyPlugin({
      patterns: entryCfg.copyFile,
    }),
    isDev && new ReactRefreshWebpackPlugin(),
    !isDev && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:5].css',
      chunkFilename: 'css/[id].[contenthash:5].css',
    }),
    isAnalyzer && new BundleAnalyzerPlugin({
      openAnalyzer: true,
      generateStatsFile: true,
      statsFilename: 'stats.json',
    }),
  ].filter(Boolean),
  devServer: {
    static: './dist',
    hot: true,
    compress: true,
    port: entryCfg.serverPort,
    host: '0.0.0.0',
  },
  optimization: {
    usedExports: true,
    minimize: true,
    runtimeChunk: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          enforce: true,
        },
      },
    },
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    symlinks: false,
  },
  performance: {
    hints: false,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  devtool: isDev ? 'eval-cheap-module-source-map' : 'inline-source-map',
  mode: isDev ? 'development' : 'production',
};

module.exports = isSpeed ? smp.wrap(cfg) : cfg;
