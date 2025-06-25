const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add WebP support for better compatibility
config.resolver.assetExts.push('webp');

// Ensure all assets are included
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config; 