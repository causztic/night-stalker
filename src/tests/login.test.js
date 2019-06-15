import NightStalker from '../components/NightStalker';

jest.setTimeout(10000);
test('it should login correctly', async () => {
  const ns = await NightStalker.loadBrowser();
  const navigation = await ns.login(process.env.USERNAME, process.env.PASSWORD);
  expect(navigation.ok()).toBeTruthy();
});
