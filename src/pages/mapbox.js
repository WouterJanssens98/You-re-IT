/**
 * The Mapbox Page
 */

import { MAPBOX_API_KEY } from '../consts';
import MapBox from '../lib/core/MapBox';
import App from '../lib/App';

const mapboxTemplate = require('../templates/mapbox.hbs');

export default () => {
  // set the title of this page
  const title = 'Mapbox';

  // render the template
  App.render(mapboxTemplate({ title }));

  // create the MapBox options
  const mapBoxOptions = {
    container: 'mapbox',
    center: [3.670823, 51.087544],
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 13,
  };

  // create a new MapBox instance
  // NOTE: make sure the HTML is rendered before making an instance of MapBox
  // (it needs an element to render)
  if (MAPBOX_API_KEY !== '') {
    // eslint-disable-next-line no-unused-vars
    const mapBox = new MapBox(MAPBOX_API_KEY, mapBoxOptions);
  }
};
