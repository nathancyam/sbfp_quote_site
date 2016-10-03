const fs = require('fs');
const _ = require('lodash');

function initializeQuotes() {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/../scraper/quotes_id.json`, (err, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
}

class QuoteService {
  constructor() {
    this.quotes = {};
    this.origins = null;
  }

  build() {
    return initializeQuotes()
      .then(quotes => {
        this.quotes = JSON.parse(quotes.toString());
        return this;
      })
      .catch(err => console.error(err));
  }

  getRandomQuote() {
    return this.quotes[Math.floor(Math.random() * this.quotes.length)];
  }

  getRandomQuoteForDifficulty(gameMode = 'hardmode') {
    const { id, quote, game, speaker } = this.getRandomQuote();

    switch (gameMode) {
      case 'hardmode':
        return { id, quote };

      case 'show':
        return { id, quote, game };

      case 'person':
        return { id, quote, speaker };

      default:
        throw new Error('Invalid game mode type given.');
        break;
    }
  }

  getOrigins() {
    if (this.origins === null) {
      let origins = this.quotes.map(el => el.game);
      origins = _.uniq(origins).sort();
      origins = origins.reduce((accul, curr) => {
        accul[curr.replace(/\W/g, '').toLowerCase()] = curr;
        return accul;
      }, {});

      this.origins = origins;
    }

    return this.origins;
  }

  findById(qId) {
    return this.quotes.find(({ id }) => id === qId);
  }

  isCorrect(guessAttempt, both = false) {
    const quote = this.findById(guessAttempt.id);
    if (!quote) {
      throw new Error('Quote ID not found');
    }

    const originGame = quote.game.replace(/\W/g, '').toLowerCase();
    const speaker = quote.speaker.toLowerCase();

    if (both) {
      return quote.speaker.includes(speaker)
        && originGame === guessAttempt.origin;
    } else {
      return speaker.includes(guessAttempt.speaker)
        || originGame === guessAttempt.origin;
    }
  }
}

module.exports = QuoteService;
