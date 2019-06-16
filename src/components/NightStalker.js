import Grapher from './Grapher';

const puppeteer = require('puppeteer');
const storage = require('node-persist');

export default class NightStalker {
  constructor(browser, args) {
    this.browser = browser;
    this.args = args;
  }

  setUserName(username) {
    this.username = username;
  }

  async tearDown() {
    await this.browser.close();
  }

  async isLoggedIn(page = undefined) {
    const cookie = await storage.getItem('night-stalker-cookie');
    let result;

    if (Object.keys(cookie).length > 0) {
      // has cookie, try to login
      let currentPage = page;
      if (page === undefined) {
        currentPage = await this.browser.newPage();
      }
      await currentPage.setCookie(...cookie);
      await currentPage.goto('https://www.instagram.com');
      // if invalid cookie, return false
      result = await currentPage.evaluate(() => document.querySelector('html').classList.contains('logged-in'));
      if (page === undefined) {
        await currentPage.close();
      }
    } else {
      result = false;
    }

    return result;
  }

  static async loadBrowser(args = ['--no-sandbox', '--disable-setuid-sandbox']) {
    const browser = await puppeteer.launch({ args });
    await storage.init();
    return new NightStalker(browser, args);
  }

  // will be useful for downloading stories
  static async getSession() {
    return storage.getItem('night-stalker-cookie');
  }

  async login(username, password) {
    if (await this.isLoggedIn()) {
      return true;
    }
    const page = await this.browser.newPage();
    // no session, logging in
    await page.goto('https://www.instagram.com/accounts/login');
    await page.waitForSelector('input');
    await page.type('input[type="text"]', username);
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');
    const response = await page.waitForNavigation({ timeout: 10000 });
    if (response.ok()) {
      // store the cookies to be reused
      await storage.setItem('night-stalker-cookie', await page.cookies());
      await page.close();
      return true;
    }
    await page.close();
    // invalid credentials
    return false;
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

  async getStories() {
    const page = await this.browser.newPage();
    if (await this.isLoggedIn(page)) {
      await page.goto(`https://www.instagram.com/stories/${this.username}/`);

      // eslint-disable-next-line
      const userId = await page.evaluate(() => window._sharedData.entry_data.StoriesPage[0].user.id);
      page.setUserAgent('Instagram 10.26.0 (iPhone7,2; iOS 10_1_1; en_US; en-US; scale=2.00; gamut=normal; 750x1334) AppleWebKit/420+');
      const results = await page.goto(`https://i.instagram.com/api/v1/feed/user/${userId}/reel_media/`).then(res => res.json());
      await page.close();
      return results.items.map((item) => {
        if (item.media_type === 2) {
          // video
          return { code: item.code, url: item.video_versions[0].url };
        }
        if (item.media_type === 1) {
          // still image
          return { code: item.code, url: item.image_versions2.candidates[0].url };
        }
        // not sure what other media types are there
        return null;
      });
    }

    await page.close();
    throw new Error('must be logged in to get stories');
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
