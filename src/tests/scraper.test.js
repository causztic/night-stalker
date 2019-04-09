import NightStalker from '../components/NightStalker';
import GraphObject from '../components/GraphObject';

jest.setTimeout(10000);
test('it should set default args of no sandbox', async () => {
  const ns = new NightStalker('instagram');
  expect(ns.args).toEqual(['--no-sandbox', '--disable-setuid-sandbox']);
});

test('it should allow overriding of args', async () => {
  const ns = new NightStalker('instagram', ['--potato']);
  expect(ns.args).toEqual(['--potato']);
});

test('it should get posts', async () => {
  const ns = new NightStalker('instagram');
  const posts = await ns.getPosts(3);
  expect(posts).toHaveLength(3);
  expect(posts[0].media[0]).not.toBe('');
});

test('it should work for non-carousel items', async () => {
  const ns = new NightStalker('rrreol999');
  const graphObject = new GraphObject({
    id: '1',
    shortcode: 'BncH7a_h_13',
    media: '',
    thumbnail: '',
    timestamp: '',
  });

  const posts = await ns.getPostsFrom(graphObject);
  expect(posts.media).toHaveLength(1);
});

test('it should return carousel items', async () => {
  const ns = new NightStalker('rrreol999');
  const graphObject = new GraphObject({
    id: '1',
    shortcode: 'Bj4wlfajGIi',
    media: '',
    thumbnail: '',
    timestamp: '',
  });

  const posts = await ns.getPostsFrom(graphObject);
  expect(posts.media).toHaveLength(4);
});
