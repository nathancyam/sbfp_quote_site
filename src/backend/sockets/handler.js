function SocketHandler(socket, redis, store, socketActions) {

  store.subscribe(() => {
    const state = store.getState();
    redis.set('game_state', JSON.stringify(store.getState()))
      .then(() => {
        socket.emit('game:state_change', state.sockets);
      });
  });

  socket.on('game:score_point', payload => {
    console.log('game:score_point');
    console.log(payload);
    socketActions.scorePoint(payload.player, payload.score);
  });

  socket.on('game:join', payload => {
    socketActions.joinGame(payload);
  });

  socket.on('game:exit', payload => {
    socketActions.exitGame(payload);
  });

  socket.on('disconnect', () => console.log(`User disconnected`));
}

module.exports = SocketHandler;
