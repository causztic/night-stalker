import NightStalker from '../components/NightStalker';
import GraphObject from '../components/GraphObject';

jest.setTimeout(20000);

test('it should get posts', async () => {
  const ns = await NightStalker.loadBrowser();
  ns.setUserName('rrreol999');
  const posts = await ns.getPosts(3);
  console.log(posts);
  expect(posts).toHaveLength(3);
  expect(posts[0].media[0]).not.toBe('');
  await ns.tearDown();
});

test('it should work for non-carousel items', async () => {
  const ns = await NightStalker.loadBrowser();
  ns.setUserName('rrreol999');
  const graphObject = new GraphObject({
    id: '1',
    shortcode: 'BncH7a_h_13',
    media: '',
    thumbnail: '',
    timestamp: '',
  });

  const posts = await ns.getPostsFrom(graphObject);
  expect(posts.media).toHaveLength(1);
  await ns.tearDown();
});

test('it should return carousel items', async () => {
  const ns = await NightStalker.loadBrowser();
  ns.setUserName('rrreol999');
  const graphObject = new GraphObject({
    id: '1',
    shortcode: 'B1vxpQjpRoW',
    media: '',
    thumbnail: '',
    timestamp: '',
  });

  const posts = await ns.getPostsFrom(graphObject);
  expect(posts.media).toHaveLength(5);
  await ns.tearDown();
});
