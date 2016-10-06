import { getNewQuote, changeDifficulty, submitAnswer, startGame, getScoreboard } from '../main';
import { MutationTypes as Types } from './mutations';

function makeSubmitPayload(state) {
  const speaker = state.peopleOptions.selectedValue || state.quote.speaker;
  const show = state.showOptions.selectedValue || state.quote.game;
  const id = state.quote.id;
  return { speaker, show, id };
}

export default (socket) => ({
  nextQuote({ commit }) {
    getNewQuote()
      .then(quote => {
        commit(Types.UPDATE_QUOTE, quote);
      });
  },

  requestNewDifficulty({ commit }, diff) {
    changeDifficulty({ difficulty: diff })
      .then(() => getNewQuote())
      .then(quote => commit(Types.UPDATE_QUOTE, quote));
  },

  submitAnswer({ commit, state }) {
    submitAnswer(makeSubmitPayload(state))
      .then(({ score, status, correctAnswer }) => {
        commit(Types.UPDATE_SCORE, score);

        if (status === 'FAILED') {
          commit(Types.UPDATE_CORRECT_ANSWER, correctAnswer);
        } else {
          commit(Types.UPDATE_CORRECT_ANSWER, false);
        }

        return getNewQuote();
      })
      .then(quote => {
        commit(Types.UPDATE_QUOTE, quote);
      });
  },

  updateGameState({ commit }, gameState) {
    commit(Types.UPDATE_GAME_STATE, gameState);
  },

  createNewPlayer({ commit, state }, payload) {
    commit(Types.UPDATE_GAME_NEW_PLAYER, payload);
    startGame({ name: state.player.name })
      .then(player => commit(Types.UPDATE_GAME_NEW_PLAYER, player));
  },

  getScoreboard({ commit }) {
    getScoreboard()
      .then(scoreboard => commit('updateGameState', scoreboard));
  },

  rejoin({ state }) {
    startGame({ name: state.player.name });
  }
});
