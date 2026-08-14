const path = require('path')
const webpack = require('webpack')
const vueLoaderPluginModule = require('vue-loader/lib/plugin')
const VueLoaderPlugin = vueLoaderPluginModule.default || vueLoaderPluginModule
const TerserPlugin = require('terser-webpack-plugin')

const relativePath = p => path.join(__dirname, p)

module.exports = {
  mode: 'production',
  entry: {
    'live-screenshot': relativePath('registry/lib/components/live/live-screenshot/index.ts'),
  },
  output: {
    path: relativePath('dist'),
    filename: '[name].js',
    library: {
      name: 'live/live-screenshot',
      type: 'umd',
      export: 'component',
    },
  },
  externals: [
    { vue: 'Vue' },
    ({ request }, callback) => {
      const regexMatch = (regex, base) => {
        const match = request.match(regex)
        if (match) {
          const camelCase = name => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
          const subModules = match[1]
            ? match[1].split('/').map(name => (name.match(/\.vue$/) ? name.replace(/\.vue$/, '') : camelCase(name)))
            : []
          return () => callback(null, ['coreApis', ...base, ...subModules], 'root')
        }
        return null
      }
      const matches = [
        [/^@\/core\/(.+)$/, []],
        [/^@\/ui$/, ['ui']],
        [/^@\/components\/(.+)$/, ['componentApis']],
        [/^@\/plugins\/(.+)$/, ['pluginApis']],
      ]
      for (const [regex, base] of matches) {
        const matchCallback = regexMatch(regex, base)
        if (matchCallback) {
          return matchCallback()
        }
      }
      return callback()
    },
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      '@': relativePath('types'),
    },
  },
  performance: {
    hints: false,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              [
                '@babel/preset-typescript',
                {
                  allExtensions: true,
                },
              ],
            ],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
        include: [relativePath('registry')],
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              optimizeSSR: false,
              hotReload: false,
            },
          },
        ],
        include: [relativePath('registry')],
      },
      {
        test: /\.scss$/,
        oneOf: [
          {
            resourceQuery: /vue/,
            use: ['to-string-loader', 'css-loader', 'fast-sass-loader'],
          },
          {
            use: ['to-string-loader', 'css-loader', 'fast-sass-loader'],
          },
        ],
        include: [relativePath('registry')],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
}
