import NightStalker from '../components/NightStalker';

jest.setTimeout(10000);
test('it should set default args of no sandbox', async () => {
  const ns = new NightStalker();
  expect(ns.args).toEqual(['--no-sandbox', '--disable-setuid-sandbox']);
});

test('it should allow overriding of args', async () => {
  const ns = new NightStalker(['--potato']);
  expect(ns.args).toEqual(['--potato']);
});
