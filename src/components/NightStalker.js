/* eslint-env browser */

import Grapher from './Grapher';

const puppeteer = require('puppeteer');

export default class NightStalker {
  constructor(username, args) {
    this.username = username;
    if (args) {
      this.args = args;
    } else {
      this.args = ['--no-sandbox', '--disable-setuid-sandbox'];
    }
  }

  async getPostsFrom(graph) {
    const browser = await puppeteer.launch({ args: this.args });
    const page = await browser.newPage();
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

    return graph;
  }

  async getPosts(count = 3) {
    const browser = await puppeteer.launch({ args: this.args });
    const page = await browser.newPage();
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

    // const graphEdges = await this.nightmare
    //   .goto(`https://www.instagram.com/${this.username}`)
    //   .evaluate((postCount) => {
    //     const postArray = [];
    //     // eslint-disable-next-line no-underscore-dangle
    //     const [profile] = window._sharedData.entry_data.ProfilePage;
    //     // eslint-disable-next-line prefer-destructuring
    //     const edges = profile.graphql.user.edge_owner_to_timeline_media.edges;
    //     edges.slice(0, postCount).forEach((edge) => {
    //       postArray.push(edge.node);
    //     });
    //     return postArray;
    //   }, count);

    const graphs = Grapher.deconstruct(graphEdges);
    return graphs.reduce((accumulator, graph) =>
      accumulator.then(results =>
        this.getPostsFrom(graph).then((updatedGraph) => {
          results.push(updatedGraph);
          return results;
        })), Promise.resolve([]));
  }
}
