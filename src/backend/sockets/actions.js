const { bindActionCreators } = require('redux');
const TYPES = require('./types');

function joinGame(player) {
  return {
    type: TYPES.GAME_JOIN,
    payload: player
  };
}

function exitGame(player) {
  return {
    type: TYPES.GAME_EXIT,
    payload: player
  };
}

function scorePoint(player, score) {
  return {
    type: TYPES.GAME_SCORE_POINT,
    payload: {
      player,
      score
    }
  };
}

function changePlayerName(playerId, name) {
  return {
    type: TYPES.PLAYER_CHANGE_NAME,
    payload: {
      id: playerId,
      name
    }
  };
}

module.exports = (store) => {
  return bindActionCreators({
    joinGame,
    exitGame,
    scorePoint,
    changePlayerName
  }, store.dispatch);
};
