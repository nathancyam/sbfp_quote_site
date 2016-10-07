import VueRouter from 'vue-router';
import GameView from '../views/GameView.vue';
import JoinView from '../views/JoinView.vue';
import ProfileView from '../views/ProfileView.vue';

export const routes = [
  { path: '/start', component: GameView, },
  { path: '/join', component: JoinView, },
  { path: '/profile', component: ProfileView }
];

export default new VueRouter({
  name: 'hash',
  routes
});

