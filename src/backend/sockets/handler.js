function SocketHandler(socket, redis, store, socketActions) {

  store.subscribe(() => {
    const state = store.getState();
    redis.set('game_state', JSON.stringify(store.getState().sockets))
      .then(() => {
        socket.emit('game:state_change', state.sockets);
      });
  });

  socket.on('game:score_point', payload => {
    socketActions.scorePoint(payload.player, payload.score);
  });

  socket.on('game:join', payload => {
    socketActions.joinGame(payload);
  });

  socket.on('socket:register', payload => {
    socketActions.registerSocket(socket, payload.playerId);
  });

  socket.on('game:exit', payload => {
    socketActions.exitGame(payload);
  });

  socket.on('disconnect', () => {
    socketActions.exitGame(socket)
  });
}

module.exports = SocketHandler;
