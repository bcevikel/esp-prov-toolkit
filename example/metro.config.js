const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

const bobConfig = getConfig(getDefaultConfig(__dirname), {
  root,
  pkg,
  project: __dirname,
});

module.exports = {
  ...bobConfig,
  resolver: {
    ...bobConfig.resolver,
    nodeModulesPaths: [path.join(__dirname, 'node_modules'), path.join(root, 'node_modules')],
  },
  watchFolders: [...(bobConfig.watchFolders ?? []), root],
};
