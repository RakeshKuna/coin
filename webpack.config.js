const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';
const serverPort = process.env.PORT || 8080;

var configs = {
  entry: './src/client/index.js',
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
    },{
      test: /\.scss$/,
      use: [{
          loader: "style-loader"
        },
        {
          loader: "css-loader",
        },
        {
          loader: "sass-loader",
        }
      ]
    },
    // {
    //   loaders: [
    //     { test: /\.css$/, loader: "style-loader!css-loader" },
    //     // ...
    //   ]
    // },
    
    // {
    //   test: /\.css$/,
    //   use: [{
    //       loader: "style-loader"
    //     },
    //     {
    //       loader: "css-loader",
    //     },
    //     {
    //       loader: "css-loader",
    //     }
    //   ]
    // },
    {
      test: /\.(png|jpg|gif)$/i,
      use: [
          {
              loader: 'file-loader',
              options: {outputPath:'',name: '[path][name].[ext]',context: './'}
          }
        ]
      },
    ]
  },
  devServer: {
    port: 3000,
    open: true,
      proxy: {
       '/api': 'http://localhost:'+serverPort,
      },
      historyApiFallback: true

  },
  plugins: [
    //new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    })
  ]
};

module.exports= configs;

