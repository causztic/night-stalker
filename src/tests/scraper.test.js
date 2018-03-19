import NightStalker from '../components/NightStalker';

jest.setTimeout(10000);
test('it should get posts', async () => {
  const ns = new NightStalker('instagram');
  const posts = await ns.getPosts(3);
  expect(posts).toHaveLength(3);
});

