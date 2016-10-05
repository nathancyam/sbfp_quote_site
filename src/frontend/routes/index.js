import VueRouter from 'vue-router';
import GameComponent from '../views/GameView.vue';
import JoinComponent from '../views/JoinView.vue';

export const routes = [
  { path: '/start', component: GameComponent, },
  { path: '/join', component: JoinComponent, }
];

export default new VueRouter({
  name: 'hash',
  routes
});

