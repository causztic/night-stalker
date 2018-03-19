export default class GraphObject {
  constructor({ id, shortcode, media, thumbnail, timestamp }) {
    this.id = id;
    this.shortcode = shortcode;
    this.media = [media];
    this.thumbnail = thumbnail;
    this.timestamp = timestamp;
  }

  setMedia(media) {
    this.media = media;
  }
}
