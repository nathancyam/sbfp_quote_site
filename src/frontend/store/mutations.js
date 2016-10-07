export const MutationTypes = {
  UPDATE_DIFF: 'updateDiff',
  UPDATE_SHOW: 'updateShow',
  UPDATE_QUOTE: 'updateQuote',
  UPDATE_SCORE: 'updateScore',
  UPDATE_PERSON: 'updatePerson',
  UPDATE_CORRECT_ANSWER: 'updateCorrectAnswer',
  UPDATE_GAME_STATE: 'updateGameState',
  UPDATE_GAME_NEW_PLAYER: 'gameNewPlayer',
  UPDATE_PLAYER_NAME: 'updatePlayerName',
};

export default {
  [MutationTypes.UPDATE_DIFF] (state, diff) {
    state.difficultyOptions.selectedValue = diff;
  },

  [MutationTypes.UPDATE_PERSON] (state, person) {
    state.peopleOptions.selectedValue = person;
  },

  [MutationTypes.UPDATE_SHOW] (state, show) {
    state.showOptions.selectedValue = show;
  },

  [MutationTypes.UPDATE_QUOTE] (state, quote) {
    state.quote = quote;
    state.isNew = false;
  },

  [MutationTypes.UPDATE_SCORE] (state, score) {
    state.player.score = score;
  },

  [MutationTypes.UPDATE_CORRECT_ANSWER] (state, correctAnswer) {
    state.correctAnswer = correctAnswer;
  },

  [MutationTypes.UPDATE_GAME_STATE] (state, gameState) {
    state.scoreboard = gameState;
  },

  [MutationTypes.UPDATE_GAME_NEW_PLAYER] (state, payload) {
    state.player = Object.assign({}, { score: 0 }, payload);
    state.isNew = true;
  },

  [MutationTypes.UPDATE_PLAYER_NAME] (state, name) {
    state.player.name = name;
  }
};
