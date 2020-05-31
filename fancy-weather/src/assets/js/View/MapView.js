import { coordinatesGeocoder } from '../utils/utils';
import languages from '../Model/languages.json';

export default class MapView {
  searchInput;

  longitude;

  latitude;


  updateCoordinatesPanel(lat, lon) {
    new Promise((resolve, reject) => {
      const mapPanel = document.querySelector('.map-panel');
      this.latitude = mapPanel
        .querySelector('.map-panel__latitude');

      this.longitude = mapPanel
        .querySelector('.map-panel__longitude');
      const latitude = `${Math.round(lat)}°${Math.round((lat % 1) * 100)}'`;
      const longitude = `${Math.round(lon)}°${Math.round((lon % 1) * 100)}'`;
      this.latitude.textContent = latitude;
      this.longitude.textContent = longitude;
      reject(new Error('Can\'t update CoordinatesPanel'));
    }).catch((error) => error);
  }

  static flyTo(map, lat, lon) {
    return new Promise((resolve, reject) => {
      map.flyTo({
        center: [
          lon,
          lat,
        ],
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        zoom: 7,
      });
      reject(new Error('Can\'t fly to location on map'));
    }).catch((error) => error);
  }

  static addMap = (mapboxgl) => new Promise((resolve, reject) => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
    });
    resolve(map);
    reject(new Error('Can\'t load map'));
  }).catch((error) => error);


  static addMarker = (mapboxgl, map, lat, lon) => new Promise((resolve, reject) => {
    const marker = new mapboxgl.Marker()
      .setLngLat([lon, lat])
      .addTo(map);
    resolve(marker);
    reject(new Error('Can\'t add marker'));
  }).catch((error) => error);


  static addGeocoder = (mapboxgl, MapboxGeocoder, map, lang = 'en') => new Promise((resolve, reject) => {
    const language = lang === 'be' ? 'ru' : lang;
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      placeholder: languages[lang].placeholder,
      localGeocoder: coordinatesGeocoder,
      types: 'place',
      language,
      zoom: 3,
    });
    this.searchInput = document.getElementById('search-input');
    this.searchInput.innerHTML = '';
    this.searchInput.appendChild(geocoder.onAdd(map));
    resolve(geocoder);
    reject(new Error('Can\'t load geocoder'));
  }).catch((error) => error);

  changeLang(map, lang) {
    this.latitude.previousElementSibling.innerHTML = languages[lang].latitude;
    this.longitude.previousElementSibling.innerHTML = languages[lang].longitude;
    if (lang === 'be' || lang === 'ru') {
      map.setLayoutProperty('country-label', 'text-field', [
        'get',
        'name_ru',
      ]);
    } else {
      map.setLayoutProperty('country-label', 'text-field', [
        'get',
        'name_en',
      ]);
    }
  }
}
