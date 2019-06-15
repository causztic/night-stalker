import Grapher from './Grapher';

const puppeteer = require('puppeteer');

export default class NightStalker {
  constructor(browser, args, userDataDir) {
    this.browser = browser;
    this.args = args;
    this.userDataDir = userDataDir;
  }

  setUserName(username) {
    this.username = username;
  }

  async tearDown() {
    await this.browser.close();
  }

  static async isLoggedIn(page) {
    await page.goto('https://www.instagram.com');
    return page.evaluate(el => el.classList.contains('logged-in'), await page.$('html'));
  }

  static async loadBrowser(args = ['--no-sandbox', '--disable-setuid-sandbox'], userDataDir = './user_data') {
    const browser = await puppeteer.launch({ args, userDataDir });
    return new NightStalker(browser, args, userDataDir);
  }

  async login(username, password) {
    const page = await this.browser.newPage();
    if (await this.isLoggedIn(page)) {
      return page;
    }
    // no session, logging in
    await page.goto('https://www.instagram.com/accounts/login');
    await page.waitForSelector('input');
    await page.type('input[type="text"]', username);
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');
    const response = await page.waitForNavigation({ timeout: 10000 });
    if (response.ok()) {
      return page;
    }
    // invalid credentials
    throw new Error('invalid credentials.');
  }

  async getPostsFrom(graph) {
    const page = await this.browser.newPage();
    await page.goto(`https://www.instagram.com/p/${graph.shortcode}/?taken-by=${this.username}`);

    const result = await page.evaluate(() => {
      // eslint-disable-next-line
      const post = window._sharedData.entry_data.PostPage[0].graphql.shortcode_media;
      // eslint-disable-next-line
      let media = [];
      if (post.edge_sidecar_to_children) {
        media = post.edge_sidecar_to_children.edges.map(edge => edge.node.display_resources.slice(-1)[0].src);
      } else {
        media = [post.display_resources.slice(-1)[0].src];
      }
      const [captionEdge] = post.edge_media_to_caption.edges;
      const data = {
        media,
        description: captionEdge ? captionEdge.node.text : '',
      };
      return data;
    });

    graph.setMedia(result.media);
    graph.setDescription(result.description);

    await page.close();

    return graph;
  }

  async getPosts(count = 3) {
    const page = await this.browser.newPage();
    await page.goto(`https://www.instagram.com/${this.username}`);

    const graphEdges = await page.evaluate((postCount) => {
      const postArray = [];
      // eslint-disable-next-line no-underscore-dangle
      const [profile] = window._sharedData.entry_data.ProfilePage;
      // eslint-disable-next-line prefer-destructuring
      const edges = profile.graphql.user.edge_owner_to_timeline_media.edges;
      edges.slice(0, postCount).forEach((edge) => {
        postArray.push(edge.node);
      });
      return postArray;
    }, count);

    const graphs = Grapher.deconstruct(graphEdges);

    await page.close();

    return graphs.reduce((accumulator, graph) =>
      accumulator.then(results =>
        this.getPostsFrom(graph).then((updatedGraph) => {
          results.push(updatedGraph);
          return results;
        })), Promise.resolve([]));
  }
}
