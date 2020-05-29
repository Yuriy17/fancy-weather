import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export default class MapModel {
    #map;

    #lat;

    #lon;

    #geocoder;

    #marker;

    #currentLocation;

    #country;

    #city;

    constructor() {
      // eslint-disable-next-line max-len
      mapboxgl.accessToken = 'pk.eyJ1IjoieXVyaXkxNyIsImEiOiJjazQxdTA2cWswNHI3M2VxcjFweWpvYjY1In0.T8XUXNZ21r-v2aStj74Sbg';
      // eslint-disable-next-line max-len
      mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
    }

    static async addCurrentLocation() {
      let lat;
      let lon;
      let country;
      let city;
      try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const IP_TOKEN = 'e6d89eb018b0ba';
        const url = new URLSearchParams();
        url.append('token', IP_TOKEN);
        const apiCall = await fetch(`${proxyUrl}https://ipinfo.io/geo?${url}`);
        const response = await apiCall.json();
        [lat, lon] = response.loc.split(',');
        country = response.country;
        city = response.city;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      return [lat, lon, country, city];
    }


    updateCoordinates(lat, lon) {
      this.lon = lon;
      this.lat = lat;
    }

    get map() {
      return this.#map;
    }

    set map(value) {
      this.#map = value;
    }

    get country() {
      return this.#country;
    }

    set country(value) {
      this.#country = value;
    }

    get city() {
      return this.#city;
    }

    set city(value) {
      this.#city = value;
    }


    get geocoder() {
      return this.#geocoder;
    }

    set geocoder(value) {
      this.#geocoder = value;
    }


    get currentLocation() {
      return this.#currentLocation;
    }

    set currentLocation(value) {
      this.#currentLocation = value;
    }


    get lon() {
      return this.#lon;
    }

    set lon(value) {
      this.#lon = value;
    }


    get lat() {
      return this.#lat;
    }

    set lat(value) {
      this.#lat = value;
    }

    get marker() {
      return this.#marker;
    }

    set marker(value) {
      this.#marker = value;
    }

    static get mapboxgl() {
      return mapboxgl;
    }

    static get MapboxGeocoder() {
      return MapboxGeocoder;
    }
}
