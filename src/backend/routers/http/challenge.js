function ChallengeRouter(router, store) {

  router.post('/challenge', (req, res) => {
    const targetPlayerID = req.body.target;
    const socketRegistrar = store.getState().socketsReg;

    if (socketRegistrar[targetPlayerID]) {
      let socket = socketRegistrar[targetPlayerID];
      socket.emit('challenge:request', { challenger: req.session.player });
      return res.json({ status: 'SUCCESS', message: 'Found player and sent challenge request' });
    }

    return res.statusCode(404).json({ status: 'FAIL', message: `Could not find player with ID: ${req.body.target}` });
  });

  return router;
}

ChallengeRouter.middleware = ['sessionMiddleware', 'jsonParser'];
ChallengeRouter.dependencies = ['store'];

module.exports = ChallengeRouter;
