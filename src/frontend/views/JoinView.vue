<template>
  <div id="join">
    <h1>Join Game</h1>
    <input type="text" v-model="name" placeholder="Zaibatsu Grunt" @change="onNameChange($event)" />
    <button type="button" @click="joinGame">Join Game</button>
  </div>
</template>
<style>
</style>
<script>
  export default {
    computed: {
      hasPlayerId() {
        return this.$store.state.player.id !== '';
      }
    },
    created() {
      if (this.$store.state.player.id !== '') {
        this.$router.push('/start');
      }
    },
    methods: {
      onNameChange(event) {
        this.$store.commit('updatePlayerName', event.target.value);
      },
      joinGame() {
        this.$store.dispatch('createNewPlayer', { name: this.name, score: 0 });
        this.$router.push('/start');
      }
    }
  }
</script>
