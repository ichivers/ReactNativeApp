/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
    ...require('stream-browserify'),
    ...require('node-libs-react-native'),
    net: require.resolve('node-libs-react-native/mock/net'),
    tls: require.resolve('node-libs-react-native/mock/tls')
    }
  }
};
