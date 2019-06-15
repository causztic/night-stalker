import NightStalker from '../components/NightStalker';

require('dotenv').config();
const path = require('path');
const fs = require('fs-extra');

const appDir = path.dirname(require.main.filename);

jest.setTimeout(10000);

test('it should login correctly', async () => {
  let ns = await NightStalker.loadBrowser();
  fs.removeSync(`${appDir}/${ns.userDataDir}`);

  let page = await ns.browser.newPage();
  expect(NightStalker.isLoggedIn(page)).toBeFalsy();

  page = await ns.login(process.env.USERNAME, process.env.PASSWORD);
  expect(page).not.toThrow();
  await ns.tearDown();

  ns = await NightStalker.loadBrowser();
  // session should be saved
  page = await ns.browser.newPage();
  expect(NightStalker.isLoggedIn(page)).toBeTruthy();

  await ns.tearDown();
});
