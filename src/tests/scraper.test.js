import NightStalker from '../components/NightStalker';

jest.setTimeout(10000);
test('it should get posts', async () => {
  const ns = new NightStalker('rrreol999');
  const posts = await ns.getPosts(3);
  console.log(posts);
  expect(posts).toHaveLength(3);
});

