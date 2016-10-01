const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('lodash');
const crypto = require('crypto');

function fsWrite(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function fsRead(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) {
        return reject(err);
      }
      return resolve(content.toString());
    });
  })
}

const HOST_URL = 'http://twobestfriendsplay.wikia.com';
const URL = 'http://twobestfriendsplay.wikia.com/api/v1/Articles/List?limit=500';

function getQuotesFromWiki() {
  request.get(URL)
    .then(jsonResponse => {
      const { items } = JSON.parse(jsonResponse);
      const promises = items.map(({ url }) => `${HOST_URL}${url}`)
        .filter(url => !url.includes('Best_Friends_Wiki:')) // Exclude meta pages
        .map(url => request.get(url));

      return Promise.all(promises);
    })
    .then(pages => {
      console.log('resolved pages');
      const pages$ = pages.map(pg => cheerio.load(pg));
      const quotePages = pages$.filter(pg => pg('span.mw-headline#Quotes').length !== 0);
      console.log(`out of ${pages$.length} pages, we have ${quotePages.length} quotable pages`);
      const quotes = quotePages.map(el => ({
        page: el('div.header-column.header-title > h1').text(),
        text: el('#mw-content-text > dl').text()
      }))
        .map(({ page, text }) => ({
          page,
          text: text.replace("\n", '')
        }));

      return fsWrite(__dirname + '/quotes.json', JSON.stringify(quotes));
    })
    .then(() => console.log('wrote quotes to file'))
    .catch(err => console.error(err));
}

/**
 * @returns {Promise.<Object[]>}
 */
function getQuotesFromFile() {
  return fsRead(__dirname + '/quotes.json')
    .then(quotesRaw => {
      const quotes = JSON.parse(quotesRaw);
      const quoteFmt = quotes.map(({ page, text }) => (
      {
        page,
        text: _.chunk(text.split("\n").slice(1), 2)
      }
      ))
        .map(({ page, text }) => {
          let textObj = text.map(txt => _.zipObject(['quote', 'speaker'], txt))
            .filter(({ quote, speaker }) => quote.length !== 0 || typeof speaker !== 'undefined')
            .map(({ quote, speaker }) => ({ quote, speaker: speaker.slice(2) }));

          let quotes = textObj.map(el => {
            return {
              id: crypto.createHash('md5').update(el.quote).digest('hex'),
              game: page,
              quote: el.quote,
              speaker: el.speaker,
            };
          });

          return quotes ;
        });

      return _.flatten(quoteFmt);
    });
}

getQuotesFromFile()
  .then(quotes => {
    return fsWrite(__dirname + '/quotes_id.json', JSON.stringify(quotes));
  });


