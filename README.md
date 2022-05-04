<div align="center">
  <a href="https://github.com/fujia-cli/electron-webpack-react-template" target="_blank">
    <img alt="hammer logo" width="200" src="./resource/unrelease/png/256x256.png"/>
  </a>
</div>

<div align="center">
  <h1>@fujia/electron-webpack-react-template</h1>
</div>

<div align="center">

A template for electron and build with webpack & react.

</div>

<div align="center">

English | [简体中文](./README.zh-CN.md)

</div>

### Getting started

At first, you can install the cli tools by following commands:

```sh
npm i -g @fujia/cli-core

# or using yarn
yarn global add @fujia/cli-core
```

then, to initial a project with the template via above cli tools:

```sh
# step1. create project folder
mkdir [project name]; cd $_;

# step2. initial project via the template
stage init

# step3. select "default" option.

# step4. select "app" option.

# step5. entering project name and version.

# step3. select "electron-react-webpack" option.
```

of course, if you don't want to install @fujia/cli-core in global scope, it can initial a project quickly by following commands:

```sh
# step1. create project folder
mkdir [project name]; cd $_;

# step2. initial project via the template
npm init stage@latest

# the other steps follow above.
```

That's all, the project will install the dependencies and devDependencies, then running automatically.

### Starting Development

Start the app in the dev environment:

```sh
npm start
```

To package apps for the local platform:

```sh
npm run release
```

Build unpacked dir which useful to test.

```sh
npm run pack
```

### Notes

1. By default, we have disabled node integration, why? [seeing here](https://www.electronjs.org/docs/latest/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content)

if you want to enable the option or use native modules, please make the following changes:

webpack.config.renderer.base.js

```js
- target: ['web', 'electron-renderer'],
+ target: 'electron-renderer',

- library: {
-  type: 'umd',
- },
```

webpack.config.main.prod.js

```js
entry: {
   main: srcMainEntryPath,
-  preload: srcMainPreloadPath,
},
```

main.ts

```ts
webPreferences: {
+  nodeIntegration: true,
+  contextIsolation: false,
-  preload: app.isPackaged
-    ? path.join(__dirname, 'preload.js')
-    : path.join(__dirname, '../../release/bundled/preload.js'),
},
```

### Maintainers

- [fujia](https://github.com/fushenguang)

### License

MIT © [electron-webpack-react-template](https://github.com/fujia-cli/electron-webpack-react-template)

### References

1. 《深入浅出 Electron：原理、工程与实践》

2. [electron-react-boilerplate](https://electron-react-boilerplate.js.org/docs/installation/)
