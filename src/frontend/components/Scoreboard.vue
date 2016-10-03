<template>
  <div id="score-board">
    <input type="text" v-model="name" placeholder="Zaibatsu Grunt" />
    <button type="button" v-on:click="joinGame">Join Game</button>
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
  import { socket } from '../main';

  export default {
    props: ['setPlayerDetails', 'player'],
    data() {
      return {
        name: '',
        scoreboard: {}
      };
    },
    created() {
      socket.on('game:state_change', gameState => {
        this.scoreboard = gameState;
      });
    },
    methods: {
      joinGame() {
        const id = `player_${Date.now()}`;
        this.setPlayerDetails({ id, name: this.name });
        socket.emit('game:join', { id, name: this.name, score: 0 });
      }
    }
  }
</script>
