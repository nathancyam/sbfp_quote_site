function postRequest(url, data, callback) {
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      return callback(null, data);
    } else {
      return callback(err);
    }
  };

  request.onerror = function(err) {
    return callback(err);
  };

  request.send(JSON.stringify(data));
}

function next() {
  document.location.reload();
}

function updateStats(result) {
  localStorage.setItem('stats', JSON.stringify(result));
  document.location.reload();
}

function submitGuess(event) {
  event.preventDefault();
  var form = document.querySelector('#guessForm');
  var elements = Array.prototype.slice.call(form.elements);

  elements = elements.reduce(function (accul, el) {
    if (!el.getAttribute('name')) {
      return accul;
    }

    accul[el.getAttribute('name')] = el.value;
    return accul;
  }, {});

  postRequest('/guess', elements, function (err, data) {
    updateStats(data);
  });
}

function updateStatDOM () {
  var stats = localStorage.getItem('stats') || JSON.stringify({ score: 0 });
  stats = JSON.parse(stats);
  var markup = document.createDocumentFragment();

  var div = document.createElement('div');
  div.textContent = 'Score: ' + stats.score;
  markup.appendChild(div);

  var scoreNode = document.getElementById('score');
  while (scoreNode.firstChild) {
    scoreNode.removeChild(scoreNode.firstChild);
  }

  scoreNode.appendChild(markup);
}

updateStatDOM();
