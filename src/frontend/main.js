
export const socket = io();
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { bootstrapStore } from './store';

Vue.use(VueRouter);
Vue.use(Vuex);

import router from './routes';
import Main from './Main.vue';
const store = bootstrapStore(__INITIAL_STATE__, socket);

socket.on('game:state_change', gameState => {
  store.dispatch('updateGameState', gameState);
});

new Vue({
  el: '#game',
  router,
  store,
  render: h => h(Main)
});
