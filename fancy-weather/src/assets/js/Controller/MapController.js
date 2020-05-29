import MapView from '../View/MapView';
import MapModel from '../Model/MapModel';

export default class MapController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    try {
      this.model.map = await MapView.addMap(MapModel.mapboxgl);
      [this.model.lat,
        this.model.lon,
        this.model.country,
        this.model.city] = await MapModel.addCurrentLocation();
      this.model.marker = await MapView.addMarker(
        MapModel.mapboxgl,
        this.model.map,
        this.model.lat,
        this.model.lon,
      );
      this.model.geocoder = await MapView.addGeocoder(
        MapModel.mapboxgl,
        MapModel.MapboxGeocoder,
        this.model.map,
      );
      await this.view.updateCoordinatesPanel(this.model.lat, this.model.lon);
      MapView.flyTo(this.model.map, this.model.lat, this.model.lon);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  handleSearchCoordinates(lat, lon) {
    this.model.updateCoordinates(lat, lon);
    this.view.updateCoordinatesPanel(lat, lon);
  }

  async handleChangeLanguage(lang) {
    this.view.changeLang(this.model.map, lang);
    this.model.geocoder = await MapView.addGeocoder(
      MapModel.mapboxgl,
      MapModel.MapboxGeocoder,
      this.model.map,
      lang,
    );
  }

  getCoordinates = () => new Promise((resolve, reject) => {
    const arr = [this.model.lat, this.model.lon];
    resolve(arr);
    reject(new Error('Can\'t getCoordinates'));
  }).catch((error) => error);

  getLocationInfo = () => new Promise((resolve, reject) => {
    const arr = [this.model.country, this.model.city];
    resolve(arr);
    reject(new Error('Can\'t getCoordinates'));
  }).catch((error) => error);
}
