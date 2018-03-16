import GraphObject from './GraphObject';

export default class Grapher {
  // deconstruct raw GraphObjects to only have the fields we need.
  static deconstruct(edges) {
    return edges.map((edge) => {
      const {
        id,
        shortcode,
        thumbnail_src: image,
        display_url: thumbnail,
        taken_at_timestamp: timestamp,
        is_video: isVideo,
      } = edge;

      return new GraphObject({
        id, shortcode, image, thumbnail, timestamp, isVideo,
      });
    });
  }
}
