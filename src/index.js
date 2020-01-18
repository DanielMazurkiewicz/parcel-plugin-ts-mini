module.exports = (bundler) => {
    bundler.addAssetType('ts', require.resolve('./TsAsset'));
};