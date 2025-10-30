module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./src/components",
            "@assets": "./src/assets",
            "@store": "./src/store",
            "@hooks": "./src/hooks",
            "@lib": "./src/lib",
          },
        },
      ],
    ],
  };
};
