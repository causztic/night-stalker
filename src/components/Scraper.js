/* eslint-env browser */

import Nightmare from 'nightmare';

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
        Array.from(document.querySelectorAll('img'))
          .slice(1, postCount + 1).forEach((image) => {
            const post = { src: image.src, alt: image.alt };
            postArray.push(post);
          });
        return postArray;
      }, posts, count);
  }
}
