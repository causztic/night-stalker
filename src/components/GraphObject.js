export default class GraphObject {
  constructor({ id, shortcode, image, thumbnail, timestamp, isVideo }) {
    this.id = id;
    this.shortcode = shortcode;
    this.image = image;
    this.thumbnail = thumbnail;
    this.timestamp = timestamp;
    this.isVideo = isVideo;
  }

  setVideo(video) {
    this.video = video;
  }
}
