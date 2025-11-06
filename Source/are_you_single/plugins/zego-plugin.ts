module.exports = function withZego(config) {
  config.android = config.android || {};
  config.android.permissions = [
    ...(config.android.permissions || []),
    "android.permission.CAMERA",
    "android.permission.RECORD_AUDIO",
  ];
  return config;
};
