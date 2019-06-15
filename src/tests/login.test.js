import NightStalker from '../components/NightStalker';

require('dotenv').config();
const path = require('path');
const fs = require('fs-extra');

jest.setTimeout(10000);
let ns;

test('it should login correctly', async () => {
  ns = await NightStalker.loadBrowser();
  fs.removeSync(path.join(__dirname, '../../', ns.userDataDir));

  let page = await ns.browser.newPage();
  expect(await NightStalker.isLoggedIn(page)).toBeFalsy();

  await ns.login(process.env.USERNAME, process.env.PASSWORD);
  await ns.tearDown();

  ns = await NightStalker.loadBrowser();
  // session should be saved
  page = await ns.browser.newPage();
  expect(await NightStalker.isLoggedIn(page)).toBeTruthy();
});

afterAll(async () => {
  await ns.tearDown();
});
