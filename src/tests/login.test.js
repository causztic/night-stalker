import NightStalker from '../components/NightStalker';

require('dotenv').config();

jest.setTimeout(20000);

test('it should login correctly', async () => {
  let ns = await NightStalker.loadBrowser();

  if (!await ns.isLoggedIn()) {
    expect(await ns.login(process.env.USERNAME, process.env.PASSWORD)).toBeTruthy();
    ns.tearDown();

    ns = await NightStalker.loadBrowser();
    // session should be saved
    expect(await ns.isLoggedIn()).toBeTruthy();
  }

  await ns.tearDown();
});

test('it should get stories', async () => {
  const ns = await NightStalker.loadBrowser();
  await ns.login(process.env.USERNAME, process.env.PASSWORD);
  // will fail if instagram has no stories..need to find a better way to test
  ns.setUserName('instagram');
  const stories = await ns.getStories();
  stories.forEach((story) => {
    expect(story).toBeTruthy();
    expect(new RegExp(/\.mp4\?|\.jpg\?/).test(story.url)).toBeTruthy();
  });
  await ns.tearDown();
});

test('it should not fail if no stories', async () => {
  const ns = await NightStalker.loadBrowser();
  await ns.login(process.env.USERNAME, process.env.PASSWORD);
  ns.setUserName('grafrore');
  const stories = await ns.getStories();
  expect(stories.length).toBe(0);
  await ns.tearDown();
});

test('it should return the correct structure for getLive', async () => {
  const ns = await NightStalker.loadBrowser();
  await ns.login(process.env.USERNAME, process.env.PASSWORD);
  // will fail if instagram has no stories..need to find a better way to test
  ns.setUserName('rrreol999');
  const live = await ns.getLive();
  expect(Object.keys(live).includes('live')).toBeTruthy();
  await ns.tearDown();
});
