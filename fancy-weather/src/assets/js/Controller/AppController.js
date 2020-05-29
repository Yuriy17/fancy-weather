/* eslint-disable max-len */

import MapController from './MapController';
import MapModel from '../Model/MapModel';
import MapView from '../View/MapView';
import WeatherController from './WeatherController';
import WeatherModel from '../Model/WeatherModel';
import WeatherView from '../View/WeatherView';

export default class AppController {
    mapController;

    weatherController;

    view;

    model;

    constructor(view, model) {
      this.view = view;
      this.model = model;
    }

    async init() {
      try {
        this.view.init();
        await this.view.showLoading();
        this.mapController = new MapController(
          new MapModel(),
          new MapView(),
        );
        await this.mapController.init();
        this.weatherController = new WeatherController(
          new WeatherModel(),
          new WeatherView(),
        );
        const coords = await this.mapController.getCoordinates();
        const locInfo = await this.mapController.getLocationInfo();

        this.model.updateCoordinates(coords);
        await this.weatherController.init(coords, locInfo);
        await this.view.bindSearchCoordinates(
          this.handleSearch.bind(this),
          this.mapController.model.geocoder,
        );
        await this.view.bindChangeTemperatureType(this.handleChangeTemperatureType.bind(this));
        await this.view.bindChangeLanguage(this.handleChangeLanguage.bind(this));
        await this.view.bindChangeBackground(this.handleChangeBackground.bind(this));
        await this.model.reloadBackground(this.weatherController.getCurrentTime(), this.weatherController.getWeatherString());
        this.view.addBackground(this.model.backgroundImageURL);
        await this.view.hideLoading();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    handleSearch(lat, lon, city, country) {
      this.view.showLoading();
      this.mapController.handleSearchCoordinates(lat, lon);
      this.weatherController.handleSearchCoordinates(lat, lon, city, country);
      this.model.updateCoordinates([lat, lon]);
      this.handleChangeBackground();
      this.view.hideLoading();
    }

    async handleChangeTemperatureType() {
      await this.view.showLoading();
      this.weatherController.handleChangeTemperatureType(this.view.changeTemperatureType());
      await this.view.hideLoading();
    }

    async handleChangeLanguage(lang) {
      await this.view.showLoading();
      await this.mapController.handleChangeLanguage(lang);
      await this.view.bindSearchCoordinates(
        this.handleSearch.bind(this),
        this.mapController.model.geocoder,
      );
      this.weatherController.handleChangeLanguage(lang);
      await this.view.hideLoading();
    }

    async handleChangeBackground() {
      await this.view.showLoading();
      this.model.reloadBackground(this.weatherController.getCurrentTime(), this.weatherController.getWeatherString());
      this.view.addBackground(this.model.backgroundImageURL);
      await this.view.hideLoading();
    }
}
