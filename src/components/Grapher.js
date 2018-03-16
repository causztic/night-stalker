import GraphObject from './GraphObject';

export default class Grapher {
  // deconstruct raw GraphObjects to only have the fields we need.
  static deconstruct(edges) {
    return edges.map((edge) => {
      const {
        id,
        thumbnail_src: thumbnail,
        taken_at_timestamp: timestamp,
        is_video: isVideo,
      } = edge;
      return new GraphObject({
        id, thumbnail, timestamp, isVideo,
      });
    });
  }
}
