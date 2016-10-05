<template>
  <div id="score-board">
    <input type="text" v-model="name" placeholder="Zaibatsu Grunt" @change="onNameChange($event)" />
    <button type="button" @click="joinGame" v-show="!hasPlayerId">Join Game</button>
    <ul>
      <li v-for="player in scoreboard.players">
        {{ player }}
      </li>
    </ul>
  </div>
</template>
<style>
</style>
<script>
  export default {
    computed: {
      scoreboard() {
        return this.$store.state.scoreboard;
      },
      name() {
        return this.$store.state.player.name;
      },
      hasPlayerId() {
        return this.$store.state.player.id !== '';
      }
    },
    methods: {
      onNameChange(event) {
        this.$store.commit('updatePlayerName', event.target.value);
      },
      joinGame() {
        this.$store.dispatch('createNewPlayer', { name: this.name, score: 0 });
      }
    }
  }
</script>
