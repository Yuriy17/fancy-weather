/* eslint-disable max-len */
import { MDCSelect } from '@material/select';
import { hasClass, addClass, removeClass } from '../utils/utils';

export default class AppView {
    select;

    controlPanel;

    switchButtons;

    buttonReload;

    buttonF;

    buttonC;

    init() {
      AppView.render();
      this.controlPanel = document.querySelector('.control-panel');
      [this.buttonReload, this.buttonF, this.buttonC] = this.controlPanel.querySelectorAll('.mdc-button__ripple');
      this.select = new MDCSelect(document.querySelector('.mdc-select'));
    }


    hideLoading = () => new Promise((resolve, reject) => {
      const loading = document.getElementById('loading');
      setTimeout(() => {
        loading.style.visibility = 'hidden';
        loading.style.opacity = '0';
      }, 1300);
      reject(new Error('Can\'t load'));
    }).catch((error) => error);

    showLoading = () => new Promise((resolve, reject) => {
      const loading = document.getElementById('loading');
      loading.style.visibility = 'visible';
      loading.style.opacity = '1';
      reject(new Error('Can\'t load'));
    }).catch((error) => error);

    bindSearchCoordinates = (handler, geocoder) => new Promise((resolve, reject) => {
      geocoder.on('result', (e) => {
        const place = e.result.place_name.split(', ');
        const city = place[0];
        const country = place[place.length - 1];
        /*         if (place[place.length - 1] === 2) {
          const lang = e.result.language.toUpperCase();
          country = languages[lang].country[place[place.length - 1]];
        } else { */

        handler(
          e.result.center[1],
          e.result.center[0],
          city,
          country,
        );
      });
      reject(new Error('Can\'t bind geocoder locate on map'));
    }).catch((error) => error);


    bindChangeTemperatureType = (handler) => new Promise((resolve, reject) => {
      this.buttonF.addEventListener('click', () => {
        handler();
      });
      this.buttonC.addEventListener('click', () => {
        handler();
      });
      reject(new Error('Can\'t bind geocoder locate on map'));
    }).catch((error) => error);

    bindChangeLanguage = (handler) => new Promise((resolve, reject) => {
      this.select.listen('MDCSelect:change', () => {
        handler(this.select.value);
      });
      reject(new Error('Can\'t bind change language'));
    }).catch((error) => error);

    bindChangeBackground = (handler) => new Promise((resolve, reject) => {
      const reload = this.controlPanel.querySelector('button > span');
      reload.addEventListener('click', () => handler());
      reject(new Error('Can\'t bind change language'));
    }).catch((error) => error);

    changeTemperatureType() {
      const buttonCelsius = this.buttonC.closest('button');
      const buttonFahrenheit = this.buttonF.closest('button');
      // toggle Fahrenheit and Celsius buttons
      let type;
      if (hasClass(buttonCelsius, 'mdc-button--raised') && hasClass(buttonFahrenheit, 'mdc-button--outlined')) {
        removeClass(buttonCelsius, 'mdc-button--raised');
        addClass(buttonCelsius, 'mdc-button--outlined');
        removeClass(buttonFahrenheit, 'mdc-button--outlined');
        addClass(buttonFahrenheit, 'mdc-button--raised');
        type = 'us';
      } else if (hasClass(buttonFahrenheit, 'mdc-button--raised') && hasClass(buttonCelsius, 'mdc-button--outlined')) {
        removeClass(buttonCelsius, 'mdc-button--outlined');
        addClass(buttonCelsius, 'mdc-button--raised');
        removeClass(buttonFahrenheit, 'mdc-button--raised');
        addClass(buttonFahrenheit, 'mdc-button--outlined');
        type = 'uk2';
      }
      return type;
    }

    // eslint-disable-next-line class-methods-use-this
    addBackground(url) {
      document.body.style.backgroundImage = `linear-gradient(
        0deg,
        rgba(68, 66, 80, 0.5) 0%,
        rgba(87, 85, 103, 0.5) 4%,
        rgba(102, 100, 122, 0.5) 10%,
        rgba(107, 105, 126, 0.5) 18%,
        rgba(141, 140, 157, 0.5) 34%,
        rgba(165, 164, 178, 0.5) 44%,
        rgba(179, 179, 190, 0.5) 51%,
        rgba(193, 193, 202, 0.5) 58%,
        rgba(211, 211, 218, 0.5) 71%,
        rgba(224, 224, 229, 0.5) 80%,
        rgba(234, 234, 238, 0.5) 85%,
        rgba(255, 255, 255, 0.5) 100%
      ), url("${url}")`;
    }


    static render() {
      document.body.insertAdjacentHTML('afterbegin', `<main class="mdc-typography">
        <div id="loading">
            <div class="psoload">
              <div class="straight"></div>
              <div class="curve"></div>
              <div class="center"></div>
              <div class="inner"></div>
            </div>
        </div>
        <div id="page" class="mdc-layout-grid">
            <div class="mdc-layout-grid__inner mdc-layout-grid__cell--align-middle header">
                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6 mdc-layout-grid__cell--span-8-tablet control-panel">
                    <button class="mdc-button mdc-button--raised">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons">autorenew</i>
                    </button>
                    <div class="mdc-select mdc-select--no-label">
                        <div class="mdc-select__anchor lang-panel-width">
                            <i class="mdc-select__dropdown-icon"></i>
                            <div class="mdc-select__selected-text"></div>
                            <div class="mdc-line-ripple"></div>
                        </div>

                        <div class="mdc-select__menu mdc-menu mdc-menu-surface">
                            <ul class="mdc-list">
                                <li class="mdc-list-item  mdc-list-item--selected" data-value="en">
                                    English
                                </li>
                                <li class="mdc-list-item" data-value="ru">
                                    Русский
                                </li>
                                <li class="mdc-list-item" data-value="be">
                                    Беларуская 
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="switch-panel">
                        <button id="fahrenheit" class="mdc-button mdc-button--outlined">
                            <span class="mdc-button__ripple"></span>
                            °F
                        </button>
                        <button id="celsius" class="mdc-button  mdc-button--raised">
                            <span class="mdc-button__ripple"></span>
                            °C
                        </button>
                    </div>
                </div>
                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6 mdc-layout-grid__cell--span-8-tablet"> 
                    <div class="search-input" id="search-input"></div>
                </div>
            </div>
            <div class="mdc-layout-grid__inner main">
                <div id="forecast" class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6 mdc-layout-grid__cell--span-8-tablet mdc-layout-grid__cell--align-middle dark-bg"></div>
                <div id="map-container" class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6 mdc-layout-grid__cell--span-8-tablet">
                    <div class="map-panel">
                        <div id="map" class="map-panel__map"></div>
                        <div class="map-panel__coordinates dark-bg">
                            <div class="map-panel__coordinate"><span class="map-panel__latitude-header">Latitude</span>: <span class="map-panel__latitude">5'</span></div>
                            <div class="map-panel__coordinate"><span class="map-panel__latitude-header">Longitude</span>: <span class="map-panel__longitude">2</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>`);
    }
}
