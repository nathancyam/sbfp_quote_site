<template>
  <section id="game">
    <nav>
      <router-link to="/start" v-if="hasPlayerId">Resume Game</router-link>
      <router-link to="/join" v-if="!hasPlayerId">Join Game</router-link>
      <router-link to="/profile" v-if="hasPlayerId">My Profile</router-link>
      <a href="/">Difficulty is too strong. Back down like a coward</a>
    </nav>
    <router-view></router-view>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        isPlaying: this.$store.state.player.id !== ''
      };
    },
    computed: {
      hasPlayerId() {
        return this.$store.state.player.id !== '';
      }
    }
  }
</script>
