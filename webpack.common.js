const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pages = [];

fs
    .readdirSync(path.resolve(__dirname, 'src', 'pages'))
    .filter((file) => {
        return file.indexOf('base') !== 0;
    })
    .forEach((file) => {
        pages.push(file.split('/', 2));
    });

const htmlPlugins = pages.map(fileName => new HtmlWebpackPlugin({
    getData: () => {
        try {
            return JSON.parse(fs.readFileSync(`./src/pages/${fileName}/data.json`, 'utf8'));
        } catch (e) {
            console.warn(`data.json was not provided for page ${fileName}`);
            return {};
        }
    },
    filename: `${fileName}.html`,
    template: `./src/pages/${fileName}/${fileName}.pug`,
    alwaysWriteToDisk: true,
    inject: 'body',
    hash: true,
}));

module.exports = {
    entry: {
        inventory: './src/entry.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: [{
                    loader: 'pug-loader',
                    options: {
                        pretty: true
                    }
          }]
        },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
            },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        },
            },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: __dirname + '/postcss.config.js'
                            }
                        },
            },
          ],
        },
            {
                test: /\.s[ac]ss$/i,
                use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]'
                    }
          }]
        },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
          }]
        },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules|\.d\.ts$/
},
            {
                test: /\.d\.ts$/,
                loader: 'ignore-loader'
},
            {
                test: /(\.js?|jsx?)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        //new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ].concat(htmlPlugins),
};
