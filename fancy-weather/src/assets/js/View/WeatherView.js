/* eslint-disable max-len */
import languages from '../Model/languages.json';

const Skycons = require('skycons')(window);

export default class WeatherView {
    date;

    currentTime;

    forecast;

    currentContainer;

    skyconsIdCount;

    language = 'en';

    country;

    city;

    async init(current, first, second, third) {
      this.forecast = document.getElementById('forecast');
      this.updateWeatherContent(current, first, second, third);
    }

    updateWeatherContent(current, first, second, third, timezone) {
      const skycons = new Skycons({ color: '#fcb8ab' });
      this.skyconsIdCount = 0;
      const currentContainer = document.createDocumentFragment();
      const currentState = document.createElement('div');
      currentState.className = 'current-state';
      currentState.insertAdjacentHTML('beforeend', this.addCurrentWeatherContent(current));
      this.date = currentState.querySelector('.current-state__date');
      this.startTime(timezone);
      currentContainer.appendChild(currentState);
      const forecast = document.createElement('div');
      forecast.className = 'forecast';
      forecast.insertAdjacentHTML('beforeend', this.addNextWeatherContent(first));
      forecast.insertAdjacentHTML('beforeend', this.addNextWeatherContent(second));
      forecast.insertAdjacentHTML('beforeend', this.addNextWeatherContent(third));
      currentContainer.appendChild(forecast);
      this.forecast.innerHTML = '';
      this.forecast.appendChild(currentContainer);


      // eslint-disable-next-line prefer-rest-params
      [...arguments].forEach((block, i) => {
        skycons.set(`skycons${i + 1}`, block.icon);
      });
      skycons.play();
    }

    startTime(timezone) {
      const today = new Date();
      const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      };

      if (timezone) {
        options.timeZone = timezone;
        this.currentTime = new Date(today.toLocaleString(languages[this.language].localeString, { timeZone: timezone }));
      } else {
        this.currentTime = new Date();
      }

      this.date.innerHTML = today.toLocaleString(languages[this.language].localeString, options);
    }

    addCurrentWeatherContent(current) {
      this.skyconsIdCount += 1;
      return `<div class="current-state__location-info">
                 <div class="current-state__places-name">${current.city}, ${current.country}</div>
                 <div id="date" class="current-state__date"></div>
             </div>
             <div class="current-state__weather-info">
                 <div class="current-state__big-number">${Math.round(current.temperature)}°</div>
                 <div class="current-state__right_info">
                     <span class="current-state__weather-icon"><canvas id="skycons${this.skyconsIdCount}" width="128" height="128"></canvas></span>
                     <div class="current-state__description">
                         <ul class="current-state__description-list">
                             <li class="current-state__description-item">${current.summary}</li>
                             <li class="current-state__description-item">${languages[this.language].feelsLike}: ${Math.round(current.apparentTemperature)}°</li>
                             <li class="current-state__description-item">${languages[this.language].wind}: ${Math.round(current.windSpeed)} ${languages[this.language].mph} </li>
                             <li class="current-state__description-item">${languages[this.language].humidity}:  ${Math.round(current.humidity * 100)}%</li>
                         </ul>
                     </div>
                 </div>
             </div>`;
    }

    addNextWeatherContent(next) {
      this.skyconsIdCount += 1;
      return `<div class="forecast__block">
            <span class="forecast__day-title">${next.day}</span>
            <div class="forecast__temperature-block">
                <div class="forecast__temperature">${next.temperature}°</div>
                <div class="forecast__icon"><canvas id="skycons${this.skyconsIdCount}" width="64" height="64"></canvas></div>
            </div>
        </div>`;
    }
}
