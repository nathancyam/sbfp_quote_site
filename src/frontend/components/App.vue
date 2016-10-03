<template>
  <div id="quote">
    <select-node
      :name-value="diffValue"
      :select-value="difficulty"
      :select-options="diffOptions"
      @update="updateDiff"
    />

    <p>Score: {{ player.score }}</p>

    <form id="guessForm">
      <game-select
          :show-value="showValue"
          :show="show"
          :options="showOptions"
          :update="updateShow"
          :plain-value="quote.game"
      />

      <quote :current-quote="quote" />

      <person-select
          :person-value="personValue"
          :person="person"
          :options="peopleOptions"
          :update="updatePerson"
          :plain-value="quote.speaker"
      />
      <div class="buttons">
        <button type="submit" v-on:click="submitAnswer($event)">Submit</button>
        <button type="next" v-on:click="nextQuote($event)">Next Quote</button>
      </div>
      <p v-if="correctAnswer">
        Quote: {{ correctAnswer.quote }}
        {{ correctAnswer.speaker }} - {{ correctAnswer.game }}
      </p>
      <scoreboard :set-player-details="setPlayerDetails" />
    </form>
  </div>
</template>
<script>
  import SelectNode from './Select.vue';
  import Quote from './Quote.vue';
  import GameSelect from './GameSelect.vue';
  import PersonSelect from './PersonSelect.vue';
  import Scoreboard from './Scoreboard.vue';
  import {
    changeDifficulty as requestDifficulty,
    getNewQuote,
    socket,
    submitAnswer
  } from '../main';

  const initialData = {
    person: 'matt',
    personValue: 'speaker',
    difficulty: difficulty,
    diffValue: 'difficulty',
    show: '007agentunderfire',
    showValue: 'show',
    peopleOptions: [
      {label: 'Liam', value: 'liam'},
      {label: 'Pat', value: 'pat'},
      {label: 'Matt', value: 'matt'},
      {label: 'Woolie', value: 'woolie'},
    ],
    diffOptions: [
      {label: 'Hard Mode', value: 'hardmode'},
      {label: 'Show Zaibatsu Member', value: 'person'},
      {label: 'Show Quote Source', value: 'show'},
    ],
    showOptions: origins,
    quote: quote,
    correctAnswer: false,
    player: {
      id: '',
      name: '',
      score: 0
    }
  };

  export default {
    data() {
      return initialData;
    },
    components: {
      Quote,
      SelectNode,
      GameSelect,
      PersonSelect,
      Scoreboard
    },
    methods: {
      setPlayerDetails(player) {
        this.player = player;
      },

      updatePerson(person) {
        this.person = person;
      },

      updateDiff(diff) {
        this.difficulty = diff;

        requestDifficulty({ difficulty: diff })
          .then(res => getNewQuote())
          .then(quote => {
            this.quote = quote;
          });
      },

      updateShow(show) {
        this.show = show;
      },

      nextQuote(event) {
        event.preventDefault();
        getNewQuote()
          .then(quote => {
            this.quote = quote;
          });
      },

      submitAnswer(event) {
        event.preventDefault();
        submitAnswer({
          id: this.quote.id,
          speaker: this.person,
          game: this.show,
        })
        .then(res => {
          this.player.score = res.score;

          if (res.status === 'FAILED') {
            this.correctAnswer = res.correctAnswer;
          } else {
            socket.emit('game:score_point', { player: this.player, score: this.player.score });
            this.correctAnswer = false;
          }
          return getNewQuote();
        })
        .then(quote => {
          this.quote = quote;
        });
      }
    }
  }
</script>
