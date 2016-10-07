import { MutationTypes as Types } from './mutations';

function makeSubmitPayload(state) {
  const speaker = state.peopleOptions.selectedValue || state.quote.speaker;
  const show = state.showOptions.selectedValue || state.quote.game;
  const id = state.quote.id;
  return { speaker, show, id };
}

export default (socket, client) => ({
  nextQuote({ commit }) {
    client.getNewQuote()
      .then(quote => {
        commit(Types.UPDATE_QUOTE, quote);
      });
  },

  requestNewDifficulty({ commit }, diff) {
    client.changeDifficulty({ difficulty: diff })
      .then(() => client.getNewQuote())
      .then(quote => commit(Types.UPDATE_QUOTE, quote));
  },

  submitAnswer({ commit, state }) {
    client.submitAnswer(makeSubmitPayload(state))
      .then(({ score, status, correctAnswer }) => {
        commit(Types.UPDATE_SCORE, score);

        if (status === 'FAILED') {
          commit(Types.UPDATE_CORRECT_ANSWER, correctAnswer);
        } else {
          commit(Types.UPDATE_CORRECT_ANSWER, false);
        }

        return client.getNewQuote();
      })
      .then(quote => {
        commit(Types.UPDATE_QUOTE, quote);
      });
  },

  updateGameState({ commit }, gameState) {
    commit(Types.UPDATE_GAME_STATE, gameState);
  },

  updatePlayerName({ commit }, playerName) {
    client.changeName(playerName)
      .then(player => commit(Types.UPDATE_PLAYER_NAME, playerName));
  },

  createNewPlayer({ commit, state }, payload) {
    commit(Types.UPDATE_GAME_NEW_PLAYER, payload);
    client.startGame({ name: state.player.name })
      .then(player => commit(Types.UPDATE_GAME_NEW_PLAYER, player));
  },

  getScoreboard({ commit }) {
    client.getScoreboard()
      .then(scoreboard => commit('updateGameState', scoreboard));
  },

  rejoin({ state }) {
    client.startGame({ id: state.player.id });
  }
});
