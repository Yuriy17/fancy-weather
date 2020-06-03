import MapView from '../View/MapView';
import MapModel from '../Model/MapModel';

export default class MapController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init(language) {
    this.model.map = await MapView.addMap(MapModel.mapboxgl);
    [this.model.lat, this.model.lon, this.model.country, this.model.city] = await MapModel.addCurrentLocation();
    this.model.marker = await MapView.addMarker(MapModel.mapboxgl, this.model.map, this.model.lat, this.model.lon);

    this.model.geocoder = await MapView.addGeocoder(MapModel.mapboxgl, MapModel.MapboxGeocoder, this.model.map, language);

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.view.addSpeechRecognitionIcon();
    this.view.bindSpeechRecognition(this.handleSpeechRecognition.bind(this));

    await this.view.updateCoordinatesPanel(this.model.lat, this.model.lon);
    MapView.flyTo(this.model.map, this.model.lat, this.model.lon);
  }

  handleSpeechRecognition() {
    if (this.recognition) {
      if (this.view.speechRecognitionElement.classList.contains('active')) {
        this.recognition.stop();
      } else {
        this.recognition.start();
      }
    } else {
      this.recognition = new window.SpeechRecognition();
      this.recognition.interimResults = true;
      this.recognition.addEventListener('result', (e) => {
        const transcript = Array.from(e.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        this.view.searchInputElement.value = transcript;
      });
      this.recognition.addEventListener('end', () => {
        this.view.speechRecognitionElement.classList.remove('active');
      });
      this.recognition.addEventListener('start', () => {
        this.view.speechRecognitionElement.classList.add('active');
      });
      this.recognition.start();
    }
  }

  handleSearchCoordinates(lat, lon) {
    this.model.updateCoordinates(lat, lon);
    this.view.updateCoordinatesPanel(lat, lon);
  }

  async handleChangeLanguage(lang) {
    this.view.changeLang(this.model.map, lang);
    this.model.geocoder = await MapView.addGeocoder(MapModel.mapboxgl, MapModel.MapboxGeocoder, this.model.map, lang);
    this.view.addSpeechRecognitionIcon();
  }

  getCoordinates = () => new Promise((resolve) => {
    if (this.model.lat && this.model.lon) {
      const arr = [this.model.lat, this.model.lon];
      resolve(arr);
    } else {
      throw new Error("Can't getCoordinates");
    }
  });

  getLocationInfo = () => new Promise((resolve) => {
    if (this.model.country && this.model.city) {
      const arr = [this.model.country, this.model.city];
      resolve(arr);
    } else {
      throw new Error("Can't getLocationInfo");
    }
  });
}
