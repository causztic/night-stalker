export default class GraphObject {
  constructor({ id, image, timestamp, isVideo }) {
    this.id = id;
    this.image = image;
    this.timestamp = timestamp;
    this.isVideo = isVideo;
  }
}
