export default class GraphObject {
  constructor({ id, shortcode, image, timestamp, isVideo }) {
    this.id = id;
    this.shortcode = shortcode;
    this.image = image;
    this.timestamp = timestamp;
    this.isVideo = isVideo;
  }
}
