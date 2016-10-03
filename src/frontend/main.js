function request(method) {
  return (url, data = {}) => {

    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open(method, url, true);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          return resolve(data);
        } else {
          return reject(err);
        }
      };

      request.onerror = function (err) {
        return reject(err);
      };

      const payload = method === 'POST'
        ? JSON.stringify(data)
        : null;

      request.send(payload);
    });
  };
}

export const socket = io();
const postRequest = request('POST');
const getRequest = request('GET');

export function getNewQuote() {
  return getRequest('/guess/new');
}

export function changeDifficulty(level) {
  return postRequest('/difficulty', level);
}

export function submitAnswer(answer) {
  return postRequest('/guess', answer);
}

import Vue from 'vue';
import App from './components/App.vue';

new Vue({
  el: '#game',
  render: h => h(App)
});
