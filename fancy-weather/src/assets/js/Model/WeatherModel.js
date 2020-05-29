import languages from './languages.json';

export default class WeatherModel {
  lat;

  lon;

  city;

  country;

  lang = 'en';

  unit = 'uk2';

  getCoordinates;

  temperatureType = 'C';

  currentWeatherData;

  firstForecastData;

  secondForecastData;

  thirdForecastData;

  currentTimezone;

  currentWeatherSummary;

  async init(coords, locInfo) {
    this.updateCoordinates(coords[0], coords[1], locInfo[1], locInfo[0]);
    await this.updateWeatherData();
  }

  async getWeatherJSON() {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const token = '346d605dbf2bc536f8a40fea32bb9a90';
    const url = `https://api.darksky.net/forecast/${token}/${this.lat},${this.lon}?units=${this.unit}&lang=${this.lang}`;

    const response = await fetch(proxyUrl + url);
    const json = await response.json();

    return json;
  }

  async updateWeatherData() {
    const weatherJSON = await this.getWeatherJSON();
    let country;
    if (this.country.length === 2) {
      country = languages[this.lang].country[this.country];
    } else {
      country = this.country;
    }
    this.currentWeatherData = {
      icon: weatherJSON.currently.icon,
      temperature: weatherJSON.currently.temperature,
      apparentTemperature: weatherJSON.currently.apparentTemperature,
      summary: weatherJSON.currently.summary,
      windSpeed: weatherJSON.currently.windSpeed,
      humidity: weatherJSON.currently.humidity,
      country,
      city: this.city,
    };

    this.currentWeatherSummary = weatherJSON.currently.icon;
    const firstDate = new Date(weatherJSON.daily.data[1].time * 1000);
    this.firstForecastData = {
      icon: weatherJSON.daily.data[1].icon,
      temperature: Math.floor((weatherJSON.daily.data[1].temperatureHigh + weatherJSON.daily.data[1].temperatureLow) / 2),
      day: this.setDay(firstDate),
    };
    const secondDate = new Date(weatherJSON.daily.data[2].time * 1000);
    this.secondForecastData = {
      icon: weatherJSON.daily.data[2].icon,
      temperature: Math.floor((weatherJSON.daily.data[2].temperatureHigh + weatherJSON.daily.data[2].temperatureLow) / 2),
      day: this.setDay(secondDate),
    };
    const thirdDate = new Date(weatherJSON.daily.data[3].time * 1000);
    this.thirdForecastData = {
      icon: weatherJSON.daily.data[3].icon,
      temperature: Math.floor((weatherJSON.daily.data[3].temperatureHigh + weatherJSON.daily.data[3].temperatureLow) / 2),
      day: this.setDay(thirdDate),
    };
    this.currentTimezone = weatherJSON.timezone;
  }

  setDay(date) {
    return languages[this.lang].weekday[date.getDay()];
  }

  updateCoordinates(lat, lon, city, country) {
    this.lon = lon;
    this.lat = lat;
    this.city = city;
    this.country = country;
  }
}
