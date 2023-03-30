module.exports = {
  webpack: {
    configure: {
      experiments: {
        topLevelAwait: true,
      },
      resolve: {
        fallback: {
          buffer: require.resolve("buffer/"),
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
        },
      },
    },
  },
};
