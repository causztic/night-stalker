/* eslint-env browser */

import Nightmare from 'nightmare';
import Grapher from './Grapher';

export default class NightStalker {
  constructor(username) {
    this.username = username;
    this.nightmare = Nightmare({ show: false });
  }

  async getPostsFrom(graph) {
    await this.nightmare
      .goto(`https://www.instagram.com/p/${graph.shortcode}/?taken-by=${this.username}`)
      .evaluate(() => {
        const videos = document.querySelector('video') ? Array.from(document.querySelector('video')) : [];
        const images = Array.from(document.querySelectorAll('img')).splice(1);
        const data = {
          media: videos.concat(images).map(image => image.src),
          description: '',
        };
        if (images.length > 0) {
          data.description = images[0].alt;
        }
        return data;
      })
      .then((result) => {
        graph.setMedia(result.media);
        graph.setDescription(result.description);
      });
    return graph;
  }

  async getPosts(count = 3) {
    const graphEdges = await this.nightmare
      .goto(`https://www.instagram.com/${this.username}`)
      .evaluate((postCount) => {
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
    return graphs.reduce((accumulator, graph) =>
      accumulator.then(results =>
        this.getPostsFrom(graph).then((updatedGraph) => {
          results.push(updatedGraph);
          return results;
        })), Promise.resolve([]))
      .then((results) => {
        this.nightmare.end().then();
        return results;
      });
  }
}
