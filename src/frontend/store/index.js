import { Store } from 'vuex';
import mutations from './mutations';
import actions from './actions';
import * as client from '../services';

const getters = {
};

export const bootstrapStore = (state = {}, socket) => {
  const bindSocketActions = actions(socket, client);

  return new Store({
    state,
    getters,
    actions: bindSocketActions,
    mutations
  });
};
