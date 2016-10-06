<template>
  <section>
    <div id="quote">
      <p>Score: {{ currentScore }}</p>

      <form id="guessForm">
        <game-select :options="showOptions" :plain-value="quote.game" :update="updateShow" />

        <quote :current-quote="quote" />

        <person-select :options="peopleOptions" :plain-value="quote.speaker" :update="updatePerson" />

        <div class="buttons">
          <button type="button" @click="submitAnswer">Submit</button>
          <button type="button" @click="nextQuote">Next Quote</button>
        </div>

        <p v-if="correctAnswer">
          Quote: {{ correctAnswer.quote }}
          {{ correctAnswer.speaker }} - {{ correctAnswer.game }}
        </p>
      </form>
    </div>
    <scoreboard />
  </section>
</template>
<script>
  import { mapState, mapActions } from 'vuex';
  import SelectNode from '../components/Select.vue';
  import Quote from '../components/Quote.vue';
  import GameSelect from '../components/GameSelect.vue';
  import PersonSelect from '../components/PersonSelect.vue';
  import Scoreboard from '../components/Scoreboard.vue';

  const _methods = Object.assign({}, mapActions([
    'submitAnswer',
    'requestNewDifficulty',
    'nextQuote',
  ]), {
    updateShow(show) {
      this.$store.commit('updateShow', show);
    },
    updatePerson(person) {
      this.$store.commit('updatePerson', person);
    }
  });

  export default {
    name: 'GameObject',
    computed: mapState({
      currentScore: state => state.player.score,
      correctAnswer: state => state.correctAnswer,
      quote: state => state.quote,
      peopleOptions: state => state.peopleOptions,
      showOptions: state => state.showOptions,
      difficultyOptions: state => state.difficultyOptions
    }),
    created() {
      this.$store.dispatch('rejoin');
      this.$store.dispatch('getScoreboard');
    },
    components: {
      Quote,
      SelectNode,
      GameSelect,
      PersonSelect,
      Scoreboard
    },
    methods: _methods
  }
</script>
