/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lacaster University, Leadin, RBB, Mediaset
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * AUTHORS:
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Benedikt Vogel    (vogel@irt.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
var webpack = require('webpack');
var path = require('path');
var stage = process.env.NODE_ENV || 'dev';
var GitRevisionPlugin = require('git-revision-webpack-plugin');
//var ES5to3OutputPlugin = require('es5to3-webpack-plugin');

let getPlugins = (stage) => {

  const env = (stage) => (
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${stage}'`,
      },
      DEBUG: stage !== 'production'
    })
  );

  var plugins = [
    env(stage),
    //new ES5to3OutputPlugin()
  ];

  if (stage !== 'dev') {
    plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true
        }
      })
    )
  }

  plugins.push(new GitRevisionPlugin());
  return plugins;
};

var createConfig = (entry, extraPlugin = [], extraLoader = []) => ({
  context: path.join(__dirname, 'react_src'),
  entry,
  devtool: stage === 'dev' ? 'inline-sourcemap' : null,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'react_src'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'].concat(extraPlugin),
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ].concat(extraLoader)
  },
  output: {
    path: __dirname + '/js/',
    filename: '[name].min.js',
    libraryTarget: 'var',
    // `library` determines the name of the global variable
    library: '[name]'
  },
  externals: {},
  plugins: getPlugins(stage),
  resolve: {
    extensions: ['', '.js', '.jsx'],
  }
});

const backendConfig = createConfig({
    mpat_admin: [
      './backend/components/contenttypes/Audio.jsx',
      './backend/components/contenttypes/Text.jsx',
      './backend/components/contenttypes/Data.jsx',
      './backend/components/contenttypes/DataFromStreamEvent.jsx',
      './backend/components/contenttypes/Broadcast.jsx',
      './backend/components/contenttypes/Clone.jsx',
      './backend/components/contenttypes/Image.jsx',
      './backend/components/contenttypes/gallery/Gallery.jsx',
      './backend/components/contenttypes/Launcher.jsx',
      './backend/components/contenttypes/Link.jsx',
      './backend/components/contenttypes/List.jsx',
      './backend/components/contenttypes/Menu.jsx',
      './backend/components/contenttypes/RedButton.jsx',
      './backend/components/contenttypes/ScribbleLive.jsx',
      './backend/components/contenttypes/ScrolledText.jsx',
      './backend/components/contenttypes/Text.jsx',
      './backend/components/contenttypes/ToggleTracking.jsx',
      './backend/components/contenttypes/Video.jsx',
      './backend/admin.jsx'
    ],
    mpat_app_manager: [
      './backend/components/contenttypes/Audio.jsx',
      './backend/components/contenttypes/Text.jsx',
      './backend/components/contenttypes/Data.jsx',
      './backend/components/contenttypes/DataFromStreamEvent.jsx',
      './backend/components/contenttypes/Broadcast.jsx',
      './backend/components/contenttypes/Clone.jsx',
      './backend/components/contenttypes/gallery/Gallery.jsx',
      './backend/components/contenttypes/Image.jsx',
      './backend/components/contenttypes/Launcher.jsx',
      './backend/components/contenttypes/Link.jsx',
      './backend/components/contenttypes/List.jsx',
      './backend/components/contenttypes/Menu.jsx',
      './backend/components/contenttypes/RedButton.jsx',
      './backend/components/contenttypes/ScribbleLive.jsx',
      './backend/components/contenttypes/ScrolledText.jsx',
      './backend/components/contenttypes/Text.jsx',
      './backend/components/contenttypes/ToggleTracking.jsx',
      './backend/components/contenttypes/Video.jsx',
      './app_manager/app_manager.jsx'
    ],
    mpat_timeline: './backend/timeline/timeline_main.jsx',
    mpat_assets_manager: './assets/assets.js'
  }
);

const frontendConfig = createConfig({
    mpat_core: [
      'es5-shim',
      'es5-shim/es5-sham',
      'babel-polyfill',
      './frontend/components/contenttypes/TextContent.jsx',
      './frontend/components/contenttypes/DataContent.jsx',
      './frontend/components/contenttypes/DataFromStreamEventContent.jsx',
      './frontend/components/contenttypes/CloneStub.jsx',
      './frontend/components/contenttypes/ImageContent.jsx',
      './frontend/components/contenttypes/BroadcastContent.jsx',
      './frontend/components/contenttypes/VideoContent.jsx',
      './frontend/components/contenttypes/GalleryContent.jsx',
      './frontend/components/contenttypes/RedButtonContent.jsx',
      './frontend/components/contenttypes/LauncherContent.jsx',
      './frontend/components/contenttypes/ListContent.jsx',
      './frontend/components/contenttypes/AudioContent.jsx',
      './frontend/components/contenttypes/LinkContent.jsx',
      './frontend/components/contenttypes/MenuContent.jsx',
      './frontend/components/contenttypes/ToggleTrackingContent.jsx',
      './frontend/components/contenttypes/ScribbleLive.jsx',
      './frontend/components/contenttypes/ScrolledTextContent.jsx',
      './frontend/core.jsx'
    ]
  },
  ['transform-es5-property-mutators', 'babel-plugin-transform-es3-member-expression-literals', 'babel-plugin-transform-es3-property-literals', 'transform-es3-modules-literals'],
  [{ test: /\.js$/, include: /\/node_modules\//, loader: 'es3ify' }]
);

module.exports = [backendConfig, frontendConfig];
