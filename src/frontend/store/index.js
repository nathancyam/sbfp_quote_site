import { Store } from 'vuex';
import mutations from './mutations';
import actions from './actions';

const getters = {
};

export const bootstrapStore = (state = {}, socket) => {
  const bindSocketActions = actions(socket);

  return new Store({
    state,
    getters,
    actions: bindSocketActions,
    mutations
  });
};
