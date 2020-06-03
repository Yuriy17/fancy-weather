export const coordinatesGeocoder = (query) => {
  // match anything which looks like a decimal degrees coordinate pair
  const matches = query.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i,
  );
  if (!matches) {
    return null;
  }

  function coordinateFeature(lng, lat) {
    return {
      center: [lng, lat],
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      place_name: `Lat: ${lat} Lng: ${lng}`,
      place_type: ['coordinate'],
      properties: {},
      type: 'Feature',
    };
  }

  const coord1 = Number(matches[1]);
  const coord2 = Number(matches[2]);
  const geocodes = [];

  if (coord1 < -90 || coord1 > 90) {
    // must be lng, lat
    geocodes.push(coordinateFeature(coord1, coord2));
  }

  if (coord2 < -90 || coord2 > 90) {
    // must be lat, lng
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  if (geocodes.length === 0) {
    // else could be either lng, lat or lat, lng
    geocodes.push(coordinateFeature(coord1, coord2));
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  return geocodes;
};

export function setMonth(date) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[date.getMonth()];
}

export function hasClass(el, className) {
  if (el.classList) return el.classList.contains(className);
  return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
}

export function addClass(el, className) {
  if (el.classList) el.classList.add(className);
  // eslint-disable-next-line no-param-reassign
  else if (!hasClass(el, className)) el.className += ` ${className}`;
}

export function removeClass(el, className) {
  if (el.classList) el.classList.remove(className);
  else if (hasClass(el, className)) {
    const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
    // eslint-disable-next-line no-param-reassign
    el.className = el.className.replace(reg, ' ');
  }
}

function getSeason(date) {
  return Math.floor(((date.getMonth() + 1) / 12) * 4) % 4;
}

export function getSearchParams(userTime, userWeather, latitude) {
  let season = '';
  let timeOfDay = '';
  let weather;
  switch (userWeather) {
    case 'clear-day':
      weather = 'day';
      break;
    case 'clear-night':
      weather = 'night';
      break;
    case 'partly-cloudy-day':
      weather = 'day';
      break;
    case 'partly-cloudy-night':
      weather = 'night';
      break;
    default:
      weather = userWeather;
      break;
  }

  if (latitude < 0) {
    season = ['Summer', 'Autumn', 'Winter', 'Spring'][getSeason(userTime)];
  } else {
    season = ['Winter', 'Spring', 'Summer', 'Autumn'][getSeason(userTime)];
  }

  const hour = userTime.getHours();

  if (hour > 0 && hour < 6) {
    timeOfDay = 'night';
  } else if (hour >= 6 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 18) {
    timeOfDay = 'afternoon';
  } else if (hour > 0 && hour < 6) {
    timeOfDay = 'evening';
  }

  return `${season},${timeOfDay},${weather}`;
}

export function translateUtile(targetLang, sourceLang, sourceText) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${
    sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(sourceText)}`;
  return fetch(url).then((response) => response.json()).then((response) => response[0][0][0]);
}
