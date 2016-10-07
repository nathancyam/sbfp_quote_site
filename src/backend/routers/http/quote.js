function QuoteRouter (router, quoteService) {

  router.get('/new', (req, res) => {
    const { id, quote, game } = quoteService.getRandomQuote();
    return res.json({ id, quote, game });
  });

  return router;
}

QuoteRouter.dependencies = ['quoteService'];
QuoteRouter.middleware = ['sessionMiddleware'];
module.exports = QuoteRouter;
