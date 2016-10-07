<template>
  <div class="scoreboard">
    <div class="current-player">
      Your Name: <strong>{{ name }}</strong>
    </div>
    <ul class="scoreboard__scores">
      <li v-for="player in scoreboard.players" class="scoreboard__entry" :class="{ you: player.isYou }">
        <span class="name">{{ decodeURIComponent(player.name) }}</span>
        <span class="score">{{ player.score }}</span>
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
        let players = this.$store.state.scoreboard.players;
        if (players) {
          players = players.sort((a, b) => b.score - a.score)
            .map(player => {
              player.isYou = (player.id === this.$store.state.player.id);
              return player;
            });
        }

        return Object.assign({}, this.$store.state.scoreboard, { players });
      },
      name() {
        return decodeURIComponent(this.$store.state.player.name);
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
