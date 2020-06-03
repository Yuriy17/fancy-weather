import { coordinatesGeocoder } from '../utils/utils';
import languages from '../Model/languages.json';

export default class MapView {
  searchElement;

  searchInputElement;

  longitude;

  latitude;


  updateCoordinatesPanel(lat, lon) {
    return new Promise((resolve) => {
      const mapPanel = document.querySelector('.map-panel');
      if (mapPanel && lat && lon) {
        this.latitude = mapPanel
          .querySelector('.map-panel__latitude');

        this.longitude = mapPanel
          .querySelector('.map-panel__longitude');
        const latitude = `${Math.round(lat)}°${Math.round((lat % 1) * 100)}'`;
        const longitude = `${Math.round(lon)}°${Math.round((lon % 1) * 100)}'`;
        this.latitude.textContent = latitude;
        this.longitude.textContent = longitude;
        resolve();
      } else {
        throw new Error('Can\'t update CoordinatesPanel');
      }
    });
  }

  static flyTo(map, lat, lon) {
    return new Promise((resolve) => {
      if (map && lat && lon) {
        map.flyTo({
          center: [
            lon,
            lat,
          ],
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          zoom: 7,
        });
        resolve(map);
      } else {
        throw new Error('Can\'t fly to location on map');
      }
    });
  }

  static addMap = (mapboxgl) => new Promise((resolve) => {
    if (mapboxgl) {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
      });
      resolve(map);
    } else {
      throw new Error('Can\'t load map');
    }
  });


  static addMarker = (mapboxgl, map, lat, lon) => new Promise((resolve) => {
    if (mapboxgl && map && lat && lon) {
      const marker = new mapboxgl.Marker()
        .setLngLat([lon, lat])
        .addTo(map);
      resolve(marker);
    } else {
      throw new Error('Can\'t add marker');
    }
  });


  static addGeocoder = (mapboxgl, MapboxGeocoder, map, lang) => new Promise((resolve) => {
    if (mapboxgl && MapboxGeocoder && map && lang) {
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
      this.searchElement = document.getElementById('search-input');

      this.searchElement.innerHTML = '';
      this.searchElement.appendChild(geocoder.onAdd(map));
      resolve(geocoder);
    } else {
      throw new Error('Can\'t load geocoder');
    }
  });

  addSpeechRecognitionIcon() {
    const search = document.getElementById('search-input');
    const searchInputBlockElement = search.querySelector('.mapboxgl-ctrl');
    this.searchInputElement = search.querySelector('.mapboxgl-ctrl-geocoder--input');
    this.speechRecognitionElement = document.createElement('a');
    this.speechRecognitionElement.classList.add('speech-recognition');
    this.speechRecognitionElement.innerHTML = '<i class="material-icons">mic</i>';

    searchInputBlockElement.append(this.speechRecognitionElement);
  }

  bindSpeechRecognition(handler) {
    this.speechRecognitionElement.addEventListener('click', (e) => {
      e.preventDefault();
      handler();
    });
  }

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
