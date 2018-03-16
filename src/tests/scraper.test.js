import Scraper from '../components/Scraper';

jest.setTimeout(10000);
test('it should get posts', async () => {
  const scraper = new Scraper('instagram');
  const posts = await scraper.getPosts(3);
  expect(posts).toHaveLength(3);
});

