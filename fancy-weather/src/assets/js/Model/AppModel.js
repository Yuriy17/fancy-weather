import { getSearchParams } from '../utils/utils';

export default class AppModel {
    latitude;

    longitude;

    backgroundImageURL;

    defaultPhotosURL = [
      './assets/img/default-background1.jpg',
      './assets/img/default-background2.jpeg',
      './assets/img/default-background3.jpg',
      './assets/img/default-background4.jpg',
      './assets/img/default-background5.jpg',
      './assets/img/default-background6.jpeg',
    ];

    async init(userWeather) {
      await this.reloadBackground(userWeather);
    }

    setLocalData() {
      const fancyLocalStorage = window.localStorage.getItem('fancyWeatherLocalData');

      if (fancyLocalStorage) {
        this.localData = JSON.parse(fancyLocalStorage);
      } else {
        this.localData = {
          language: 'en',
          temperatureType: 'uk2',
        };
      }

      window.addEventListener('beforeunload', () => {
        window.localStorage.setItem('fancyWeatherLocalData', JSON.stringify(this.localData));
      });
    }

    async reloadBackground(currentTime, userWeather) {
      this.backgroundImageURL = await this.getBackgroundURL(currentTime, userWeather);
    }


    async getBackgroundURL(userTime, userWeather) {
      let imageURL;
      try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const FLICKR_KEY = '6e8fefe00c7fe8f978edc4eca08c9107';
        const url = new URLSearchParams();
        const param = getSearchParams(userTime,
          userWeather, this.latitude);
        url.append('method', 'flickr.photos.search');
        url.append('tags', param);
        url.append('api_key', FLICKR_KEY);
        url.append('lat', `${this.latitude}`);
        url.append('lon', `${this.longitude}`);
        url.append('format', 'json');
        url.append('extras', 'url_l');
        url.append('nojsoncallback', '1');

        // eslint-disable-next-line no-console
        console.log(`Данные о параметрах запроса фонового изображения:
        ${param} - сезон, время суток, день или ночь
        ${this.latitude}, ${this.longitude} - широта и долгота
        `);


        const apiCall = await fetch(`${proxyUrl}https://api.flickr.com/services/rest?${url}`);
        const response = await apiCall.json();
        imageURL = (response.photos.total === '0')
          ? AppModel.getRandomURL(this.defaultPhotosURL) : this.getRandomPhotoURL(response.photos);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      return imageURL;
    }

    updateCoordinates(arr) {
      [this.latitude, this.longitude] = arr;
    }

    getRandomPhotoURL(photos, attempts = 0) {
      let a = attempts;
      const photo = AppModel.getRandomURL(photos.photo);
      if (photo.url_l) { return photo.url_l; }
      const defaultURL = AppModel.getRandomURL(this.defaultPhotosURL);
      if (a === 4) return defaultURL;
      a += 1;
      return this.getRandomPhotoURL(photos, a);
    }


    static getRandomURL(arrURL) {
      return arrURL[Math.floor(Math.random() * arrURL.length)];
    }
}
