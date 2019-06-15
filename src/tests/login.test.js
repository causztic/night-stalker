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
  // here we rely on instagram to publish stories all the time..which they probably will.
  ns.setUserName('instagram');
  const stories = await ns.getStories();
  stories.forEach((story) => {
    expect(story).toBeTruthy();
    expect(new RegExp(/\.mp4\?|\.jpg\?/).test(story)).toBeTruthy();
  });
  await ns.tearDown();
});
