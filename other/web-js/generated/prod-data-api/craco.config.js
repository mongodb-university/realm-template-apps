module.exports = {
  webpack: {
    configure: {
      experiments: {
        topLevelAwait: true,
      },
      resolve: {
        fallback: {
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
        },
      },
    },
  },
};
