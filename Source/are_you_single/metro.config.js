const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const defaultAssetExts = config.resolver.assetExts;

config.resolver.assetExts = [
  ...defaultAssetExts,
  "png",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
  "tiff",
  "webp",
];

module.exports = config;
