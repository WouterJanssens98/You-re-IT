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
      center: [3.670823, 51.087544],
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 20,
    };
  }

  getMap() {
    return this.map;
  }

  addMarker(lat, lon, name) {
    this.map.on('load', () => {
      this.map.addLayer({
        id: name,
        type: 'symbol',
        fadeDuration: 0.5,
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [
                    lat,
                    lon,
                  ],
                },
                properties: {
                  title: name,
                },
              },
            ],
          },
        },
        layout: {
          // get the icon name from the source's "icon" property
          // concatenate the name to get an icon from the style's sprite sheet
          'icon-image': ['concat', ['get', 'icon'], '-15'],
          // get the title name from the source's "title" property
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
        },
      });
    });
  }

  addPicture(lat, lon, name, type) {
    this.map.on('load', () => {
      this.map.loadImage(
        `../assets/icons/players/${type}player.png`,
        (error, image) => {
          if (error) throw error;
          this.map.addImage(type, image);
          this.map.addLayer({
            id: name,
            type: 'symbol',
            fadeDuration: 1,
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [lat, lon],
                    },
                  },
                ],
              },
            },
            layout: {
              'icon-image': type,
              'icon-size': 0.05,
            },
          });
        },
      );
    });
  }

  addAdminPicture(lat, lon, name, type) {
    this.map.on('load', () => {
      this.map.loadImage(
        `../assets/icons/players/${type}player.png`,
        (error, image) => {
          if (error) throw error;
          this.map.addImage(type, image);
          this.map.addLayer({
            id: name,
            type: 'symbol',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [lat, lon],
                    },
                  },
                ],
              },
            },
            layout: {
              'icon-image': type,
              'icon-size': 0.08,
            },
          });
        },
      );
    });
  }
}

export default MapBox;
