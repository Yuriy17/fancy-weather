import { getTime } from '../utils/utils';

export default class WeatherController {
  locale;

  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init(coords, locInfo, language, temperatureType) {
    await this.model.init(coords, locInfo, language, temperatureType);
    await this.view.init(
      this.model.currentWeatherData,
      this.model.firstForecastData,
      this.model.secondForecastData,
      this.model.thirdForecastData,
      this.model.lang,
    );

    this.locale = setInterval(() => {
      document.getElementById('time').innerText = getTime(this.model.currentTimezone);
    }, 1000);
  }

  async handleSearchCoordinates(lat, lon, city, country) {
    this.model.updateCoordinates(lat, lon, city, country);
    await this.model.updateWeatherData();
    this.model.currentWeatherData.city = city;
    this.model.currentWeatherData.country = country;
    this.view.updateWeatherContent(
      this.model.currentWeatherData,
      this.model.firstForecastData,
      this.model.secondForecastData,
      this.model.thirdForecastData,
      this.model.currentTimezone,
    );

    clearInterval(this.locale);
    this.locale = setInterval(() => {
      document.getElementById('time').innerText = getTime(this.model.currentTimezone);
    }, 2000);
  }

  async handleChangeTemperatureType(unit) {
    this.model.unit = unit;
    await this.model.updateWeatherData();
    this.view.updateWeatherContent(
      this.model.currentWeatherData,
      this.model.firstForecastData,
      this.model.secondForecastData,
      this.model.thirdForecastData,
      this.model.currentTimezone,
    );
  }

  async handleChangeLanguage(lang) {
    this.model.lang = lang;
    this.view.language = lang;
    await this.model.updateWeatherData();
    this.view.updateWeatherContent(
      this.model.currentWeatherData,
      this.model.firstForecastData,
      this.model.secondForecastData,
      this.model.thirdForecastData,
      this.model.currentTimezone,
    );
  }

  getCurrentDate() {
    return this.model.currentDate;
  }


  getWeatherString() {
    return this.model.currentWeatherSummary;
  }
}
