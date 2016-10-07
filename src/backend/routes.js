const { GameRouter, QuoteRouter } = require('./routers');

module.exports = function (app, routerBuilder) {

  app.get('/', (req, res) => {
    let bodyClass = '';
    const quote = req.app.get('quote_service').getRandomQuote();

    switch (quote.speaker.slice(0, 3).toLowerCase()) {
      case 'lia':
        bodyClass = 'quote-liam';
        break;

      case 'pat':
        bodyClass = 'quote-pat';
        break;

      case 'woo':
        bodyClass = 'quote-wool';
        break;

      case 'mat':
        bodyClass = 'quote-matt';
        break;
    }

    bodyClass += ' quote';
    res.render('quote.html.twig', { quote, bodyClass });
  });

  app.use('/quote', routerBuilder(QuoteRouter));
  app.use('/game', routerBuilder(GameRouter));
};
