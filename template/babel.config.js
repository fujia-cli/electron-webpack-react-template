module.exports =  {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      '@babel/plugin-transform-modules-commonjs', // transform ECMA modules to CommonJS
      {
        allowTopLevelThis: true,
        loose: true,
        lazy: true,
      }
    ]
  ]
}