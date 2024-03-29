const queryString = require('querystring');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const startOfWeek = require('date-fns/start_of_week');
const endOfWeek = require('date-fns/end_of_week');
const subWeeks = require('date-fns/sub_weeks');
const isThisWeek = require('date-fns/is_this_week');
const isThisMonth = require('date-fns/is_this_month');
const isFuture = require('date-fns/is_future');
const isValid = require('date-fns/is_valid');
const subMonths = require('date-fns/sub_months');
const formatDate = require('date-fns/format');
const parseDate = require('date-fns/parse');
const parse = require('url-parse');

/**
* Date parsing functions.
*/
const dateRange = function dateRange(date = Date()) {
  // Guard date parameter from being undefined or null.
  // parseDate function will split out "Invalid Date" for undefined,
  // and the beginning of Epoch time if null.
  const dateObj = parseDate(date === null || !isValid(parseDate(date)) || isFuture(date) ? Date() : date);
  const format = 'YYYYMMDD';

  return {
    realtime() {
      const realtimeFormat = format + 'HH';
      const startDate = dateObj;
      const endDate = dateObj;
      return {
        start: formatDate(startDate, realtimeFormat),
        end: formatDate(endDate, realtimeFormat),
      };
    },
    daily() {
      const startDate = dateObj;
      const endDate = dateObj;
      return {
        start: formatDate(startDate, format),
        end: formatDate(endDate, format),
      };
    },
    weekly() {
      const option = { weekStartsOn: 1 };
      const includedDate = (isThisWeek(dateObj, option)) ? subWeeks(dateObj, 1) : dateObj;

      const startDate = startOfWeek(includedDate, option);
      const endDate = endOfWeek(includedDate, option);

      return {
        start: formatDate(startDate, format),
        end: formatDate(endDate, format),
      };
    },
    monthly() {
      const monthFormat = 'YYYYMM';
      let startDate = dateObj;
      let endDate = dateObj;
      if (isThisMonth(dateObj) || isFuture(dateObj)) {
        const lastMonth = subMonths(new Date(), 1);
        startDate = lastMonth;
        endDate = lastMonth;
      }
      return {
        start: formatDate(startDate, monthFormat),
        end: formatDate(endDate, monthFormat),
      };
    },
  };
};

/**
* URL parsing functions.
*/
function makeUrlString(parsed) {
  return `http://${parsed.hostname}${parsed.pathname}?${parsed.query}`;
}

function composeUrl(period, dates, options) {
  console.log(`DEBUG: cutLine value in composeUrl: ${options.cutLine}`);
  // Base attributes which all charts need.
  let { url } = options;
  const decoded = {};
  decoded[options.indexKey] = options.cutLine > 50 ? 0 : 1;
  decoded[options.movedKey] = 'Y';
  if (period === 'realtime') {
    url = options.url.replace('day/', '');
    decoded[options.movedKey] = 'N';
    if (options.realtime) {
      decoded[options.dayTime] = dates.start.toString();
    }
  }
  if (period === 'week') {
    url = options.url.replace('day', 'week');
    decoded[options.startDateKey] = dates.start.toString();
    decoded[options.endDateKey] = dates.end.toString();
    decoded[options.isFirstDateKey] = false;
    decoded[options.isLastDateKey] = false;
  }
  if (period === 'month') {
    url = options.url.replace('day', 'month');
    decoded[options.rankMonthKey] = dates.start.toString();
  }
  const parsed = parse(url);
  const encoded = queryString.stringify(decoded);
  parsed.query = encoded;
  return makeUrlString(parsed);
}

/**
* HTML parsing functions.
*/
function extractChart(htmlText, xpath) {
  const $ = cheerio.load(htmlText);
  const chartData = [];

  // Busca elementos com a classe .lst50 ou .lst100
  $('.lst50, .lst100').each((index, element) => {
    const songTitle = $(element).find(xpath.songTitles).text().trim();
    const artistName = $(element).find(xpath.artistNames).text().trim();
    const albumNames = $(element).find(xpath.albumNames).text().trim();
    const imageUrl = $(element).find('.image_typeAll img').attr('src');

    chartData.push({
      rank: (index + 1).toString(),
      title: songTitle,
      artist: artistName,
      album: albumNames,
      imageUrl: imageUrl ? imageUrl.replace('/melon/resize/120/quality/80/optimize', '') : null,
    });
  });

  console.log(`DEBUG: Number of songs extracted in extractChart: ${chartData.length}`);
  return chartData;
}

function fetchHtmlText(url) {
  return fetch(url)
    .then(resp => resp.text())
    .then(htmlText => {
      console.log(`DEBUG: Length of HTML text: ${htmlText.length}`);
      return htmlText;
    });
}

function createMessageData(chartData, cutLine, dates) {
  console.log(`DEBUG: cutLine in createMessageData: ${cutLine}`);
  console.log(`DEBUG: Number of songs in chartData: ${chartData.length}`);
  
  return {
    data: chartData.slice(0, cutLine),
    dates,
  };
}

const scrapeMelon = function scrapeMelon(url, dates, opts = {}) {
  return fetchHtmlText(url)
    .then((htmlText) => {
      const chartData = extractChart(htmlText, opts.xpath);
      console.log(`DEBUG: Number of songs in chartData (before createMessageData): ${chartData.length}`);
      return createMessageData(chartData, opts.cutLine, dates);
    });
};

module.exports = {
  dateRange,
  scrapeMelon,
  composeUrl,
};
