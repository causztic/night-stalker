import NightStalker from '../components/NightStalker';

require('dotenv').config();
// const path = require('path');
// const fs = require('fs-extra');

jest.setTimeout(10000);
let ns;

test('it should login correctly', async () => {
  ns = await NightStalker.loadBrowser();
  // fs.removeSync(path.join(__dirname, '../../', ns.userDataDir));

  let page = await ns.browser.newPage();
  if (!await NightStalker.isLoggedIn(page)) {
    await ns.login(process.env.USERNAME, process.env.PASSWORD);
    await ns.tearDown();
  }

  ns = await NightStalker.loadBrowser();
  // session should be saved
  page = await ns.browser.newPage();
  expect(await NightStalker.isLoggedIn(page)).toBeTruthy();
});

test('it should get stories', async () => {
  ns = await NightStalker.loadBrowser();
  // here we rely on instagram to publish stories all the time..which they probably will.
  ns.setUserName('instagram');
  const stories = await ns.getStories();
  stories.forEach((story) => {
    expect(story).toBeTruthy();
    expect(new RegExp(/\.mp4\?|\.jpg\?/).test(story)).toBeTruthy();
  });
});

afterAll(async () => {
  await ns.tearDown();
});
