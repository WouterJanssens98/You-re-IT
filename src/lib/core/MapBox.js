/**
 * A MapBox wrapper
 * docs: https://docs.mapbox.com/mapbox-gl-js/api/
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

class MapBox {
  constructor(apiKey, options = {}) {
    // set the apiKey & accessToken
    this.apiKey = apiKey;
    mapboxgl.accessToken = this.apiKey;

    // set the options (in case nothing was added, get the defaultOptions)
    this.options = Object.keys(options).length === 0 ? this.getDefaultOptions() : options;

    // create a new mapbox instance
    this.map = new mapboxgl.Map(this.options);
  }

  getDefaultOptions() {
    return {
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 13,
    };
  }

  getMap() {
    return this.map;
  }
}

export default MapBox;
