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

const postRequest = request('POST');
const getRequest = request('GET');

export function getNewQuote() {
  return getRequest('/quote/new');
}

export function changeDifficulty(level) {
  return postRequest('/difficulty', level);
}

export function submitAnswer(answer) {
  return postRequest('/game/answer', answer);
}

export function startGame(player) {
  return postRequest('/game/join', player);
}

export function getScoreboard() {
  return getRequest('/game/scoreboard');
}

export function changeName(name) {
  return postRequest('/game/player/name', { name });
}

export function challengePlayer(target) {
  return postRequest('/challenge', target);
}
