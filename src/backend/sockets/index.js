const { createStore, combineReducers, applyMiddleware } = require('redux');
const reduxThunk = require('redux-thunk').default;
const reducers = require('./reducers');
const bindActions = require('./actions');
const handler = require('./handler');

const logger = store => next => action => {
  console.dir(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const store = createStore(
  combineReducers({ sockets: reducers.sockets, socketsReg: reducers.registrar }),
  applyMiddleware(logger, reduxThunk)
);

const actions = bindActions(store);

module.exports = {
  store,
  actions,
  setupSockets(io, redis) {
    io.on('connection', socket => {
      handler(socket, redis, store, actions);
    });
  }
};
