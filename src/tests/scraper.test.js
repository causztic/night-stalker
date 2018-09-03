import NightStalker from '../components/NightStalker';
import GraphObject from '../components/GraphObject';

jest.setTimeout(10000);
test('it should get posts', async () => {
  const ns = new NightStalker('instagram');
  const posts = await ns.getPosts(3);
  expect(posts).toHaveLength(3);
  expect(posts[0].media[0]).not.toBe('');
});

test('it should return carousel items', async () => {
  const ns = new NightStalker('rrreol999');
  const graphObject = new GraphObject({
    id: '1',
    shortcode: 'Bj4v4rfj0jp',
    media: '',
    thumbnail: '',
    timestamp: '',
  });

  const posts = await ns.getPostsFrom(graphObject);
  expect(posts.media).toHaveLength(5);
});
