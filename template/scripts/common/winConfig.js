if (process.platform !== 'win32') module.exports = {};
else
  module.exports = {
    icon: '../resource/unrelease/win/icon.ico',
    target: [
      {
        target: 'nsis',
        arch: ['ia32'],
      },
    ],
    publisherName: 'fujia',
    verifyUpdateCodeSignature: false,
    signingHashAlgorithms: ['sha256', 'sha1'],
    signDlls: true,
    rfc3161TimeStampServer: 'http://timestamp.digicert.com',
    certificateFile: 'sa.pfx',
    certificatePassword: 'Sp123456',
    sign: async (config) => {
      // application signature logic
    },
  };
