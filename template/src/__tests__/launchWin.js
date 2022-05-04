const testApp = require('../../script/test/index');
let app;

beforeAll(async () => {
  app = await testApp.start();
}, 16000);

afterAll(async () => {
  console.log(app && app.isRunning());
  if (app && app.isRunning()) {
    await app.stop();
  }
});

test('验证窗口数量', async function () {
  let windowCount = await app.client.getWindowCount();
  expect(windowCount).toBe(1);
});

test('验证窗口标题', async function () {
  let title = await app.client.getTitle();
  expect(title).toBe('Home Page');
});

// test('点击按钮并确认结果', async function () {
//   let btn = await app.client.$('button');
//   await btn.click();
//   await btn.click();
//   let text = await btn.getText();
//   expect(text).toBe('count is: 2');
// });
