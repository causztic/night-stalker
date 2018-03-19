import GraphObject from './GraphObject';

export default class Grapher {
  // deconstruct raw GraphObjects to only have the fields we need.
  static deconstruct(edges) {
    return edges.map((edge) => {
      const {
        id,
        shortcode,
        thumbnail_src: media,
        display_url: thumbnail,
        taken_at_timestamp: timestamp,
      } = edge;

      return new GraphObject({
        id, shortcode, media, thumbnail, timestamp,
      });
    });
  }
}
