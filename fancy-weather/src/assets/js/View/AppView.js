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

  init(temperatureType, language) {
    AppView.render(temperatureType, language);
    this.controlPanel = document.querySelector('.control-panel');
    [
      this.buttonReload,
      this.buttonF,
      this.buttonC,
    ] = this.controlPanel.querySelectorAll('.mdc-button__ripple');
    this.select = new MDCSelect(document.querySelector('.mdc-select'));
  }

  hideLoading = () => new Promise((resolve) => {
    const loading = document.getElementById('loading');
    if (loading) {
      setTimeout(() => {
        loading.style.visibility = 'hidden';
        loading.style.opacity = '0';
        resolve(loading);
      }, 1300);
    } else {
      throw new Error("Can't load");
    }
  });

  showLoading = () => new Promise((resolve) => {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.visibility = 'visible';
      loading.style.opacity = '1';
      resolve(loading);
    } else {
      throw new Error("Can't load");
    }
  });

  bindSearchCoordinates = (handler, geocoder) => new Promise((resolve) => {
    if (geocoder && handler) {
      geocoder.on('result', (e) => {
        const place = e.result.place_name.split(', ');
        const city = place[0];
        const country = place[place.length - 1];

        handler(e.result.center[1], e.result.center[0], city, country);
      });
      const inputElement = document.getElementById('search-input').querySelector('input');
      document.getElementById('search-button').addEventListener('click', () => {
        geocoder.query(inputElement.value);
      });
      resolve(geocoder);
    } else {
      throw new Error("Can't bind geocoder locate on map");
    }
  });

  bindChangeTemperatureType = (handler) => new Promise((resolve) => {
    if (handler && this.buttonF && this.buttonC) {
      this.buttonF.addEventListener('click', () => {
        handler();
      });
      this.buttonC.addEventListener('click', () => {
        handler();
      });
      resolve();
    } else {
      throw new Error("Can't bind geocoder locate on map");
    }
  });

  bindChangeLanguage = (handler) => new Promise((resolve) => {
    if (this.select && handler) {
      this.select.listen('MDCSelect:change', () => {
        handler(this.select.value);
      });
      resolve();
    } else {
      throw new Error("Can't bind change language");
    }
  });

  bindChangeBackground = (handler) => new Promise((resolve) => {
    const reload = this.controlPanel.querySelector('button > span');
    if (reload && handler) {
      reload.addEventListener('click', () => handler());
      resolve();
    } else {
      throw new Error("Can't bind change language");
    }
  });

  changeTemperatureType() {
    const buttonCelsius = this.buttonC.closest('button');
    const buttonFahrenheit = this.buttonF.closest('button');
    // toggle Fahrenheit and Celsius buttons
    let type;
    if (
      hasClass(buttonCelsius, 'mdc-button--raised')
      && hasClass(buttonFahrenheit, 'mdc-button--outlined')
    ) {
      removeClass(buttonCelsius, 'mdc-button--raised');
      addClass(buttonCelsius, 'mdc-button--outlined');
      removeClass(buttonFahrenheit, 'mdc-button--outlined');
      addClass(buttonFahrenheit, 'mdc-button--raised');
      type = 'us';
    } else if (
      hasClass(buttonFahrenheit, 'mdc-button--raised')
      && hasClass(buttonCelsius, 'mdc-button--outlined')
    ) {
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

  static render(temperatureType, language) {
    document.body.insertAdjacentHTML(
      'afterbegin',
      `<main class="mdc-typography">
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
                                <li class="mdc-list-item  ${language === 'en' ? 'mdc-list-item--selected' : ''}" data-value="en">
                                    English
                                </li>
                                <li class="mdc-list-item ${language === 'ru' ? 'mdc-list-item--selected' : ''}" data-value="ru">
                                    Русский
                                </li>
                                <li class="mdc-list-item ${language === 'be' ? 'mdc-list-item--selected' : ''}" data-value="be">
                                    Беларуская 
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="switch-panel">
                        <button id="fahrenheit" class="mdc-button mdc-button--${temperatureType === 'us' ? 'raised' : 'outlined'}">
                            <span class="mdc-button__ripple"></span>
                            °F
                        </button>
                        <button id="celsius" class="mdc-button  mdc-button--${temperatureType === 'uk2' ? 'raised' : 'outlined'}">
                            <span class="mdc-button__ripple"></span>
                            °C
                        </button>
                    </div>
                </div>
                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6 mdc-layout-grid__cell--span-8-tablet mdc-layout-grid__inner mdc-layout-grid__cell--align-middle "> 
                <div id="search-input" class="search-input mdc-layout-grid__cell mdc-layout-grid__cell--span-6-tablet mdc-layout-grid__cell--span-10 " ></div>
                <button id="search-button" class="mdc-button mdc-button--raised  mdc-layout-grid__cell mdc-layout-grid__cell--span-2 mdc-layout-grid__cell--span-2-tablet">
                    <span class="mdc-button__ripple"></span>
                    Search
                </button>
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
    </main>`,
    );
  }
}
