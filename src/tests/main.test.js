import NightStalker from '../components/NightStalker';

jest.setTimeout(10000);
test('it should set default args of no sandbox', async () => {
  const ns = await NightStalker.loadBrowser();
  expect(ns.args).toEqual(['--no-sandbox', '--disable-setuid-sandbox']);
  await ns.tearDown();
});

test('it should allow overriding of args', async () => {
  const ns = await NightStalker.loadBrowser(['--potato']);
  expect(ns.args).toEqual(['--potato']);
  await ns.tearDown();
});
