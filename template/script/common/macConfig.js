if (process.platform !== 'darwin') module.exports = {};
else
  module.exports = {
    icon: 'resource/unrelease/icon.icns',
    type: 'distribution',
    identity:
      'Apple Distribution: <%= packageName %> System Technology Co., Ltd.',
  };
