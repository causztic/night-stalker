/* eslint-env browser */

import Nightmare from 'nightmare';
import Grapher from './Grapher';

export default class Scraper {
  constructor(username) {
    this.username = username;
    this.nightmare = Nightmare({ show: false });
  }

  async getPosts(count = 3) {
    const posts = [];
    return this.nightmare
      .goto(`https://www.instagram.com/${this.username}`)
      .evaluate((postArray, postCount) => {
        // eslint-disable-next-line no-underscore-dangle
        const [profile] = window._sharedData.entry_data.ProfilePage;
        // eslint-disable-next-line prefer-destructuring
        const edges = profile.graphql.user.edge_owner_to_timeline_media.edges;
        edges.slice(0, postCount).forEach((edge) => {
          postArray.push(edge.node);
        });
        return postArray;
      }, posts, count)
      .end((edges) => {
        const graphs = Grapher.deconstruct(edges);
        return graphs;
      });
  }
}
