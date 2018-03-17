/* eslint-env browser */

import Nightmare from 'nightmare';
import Grapher from './Grapher';

export default class NightStalker {
  constructor(username) {
    this.username = username;
    this.nightmare = Nightmare({ show: true });
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

    // if (graph.isVideo) {
    //   return this.nightmare
    //     .click(`a[href="/p/${graph.shortcode}/?taken-by=${this.username}"`)
    //     .wait(`video[poster='${graph.thumbnail}']`)
    //     .evaluate(() => {
    //       const { src } = document.querySelector('video');
    //       document.evaluate('//button[text()="Close"]', document).iterateNext().click();
    //       return src;
    //     })
    // }

    return graphs.reduce((accumulator, graph) =>
      accumulator.then(results => this.nightmare
        .click(`a[href="/p/${graph.shortcode}/?taken-by=${this.username}"`)
        .wait(() => document.querySelectorAll('article').length === 2)
        .evaluate(
          isVideo =>
            new Promise((resolve, reject) => {
              if (isVideo) {
                const { src } = document.querySelector('video');
                document.evaluate('//button[text()="Close"]', document).iterateNext().click();
                resolve(src);
              }
              // otherwise, attempt to click next.
              let rightButton;
              const images = [];
              do {
                rightButton = document.querySelectorAll('article')[1].querySelector('.coreSpriteRightChevron');
                const imageContainer = Array.from(document.querySelectorAll('img')).slice(-1)[0];
                images.push(imageContainer.src);
                if (rightButton) {
                  rightButton.click();
                }
              } while (rightButton);
              document.evaluate('//button[text()="Close"]', document).iterateNext().click();

              resolve(images);
            })
          , graph.isVideo,
        ).then((result) => {
          if (graph.isVideo) {
            graph.setVideo(result);
          } else {
            graph.setImages(result);
          }
          results.push(graph);
          return results;
        })), Promise.resolve([]));
  }
}
