if (process.platform !== 'darwin') module.exports = {};
else
  module.exports = {
    background: 'resource/unrelease/appdmg.jpg',
    icon: 'resource/unrelease/mac/icon.icns',
    iconSize: 80,
    sign: false,
    contents: [
      {
        x: 380,
        y: 280,
        type: 'link',
        path: '/Applications',
      },
      {
        x: 110,
        y: 280,
        type: 'file',
      },
    ],
  };
