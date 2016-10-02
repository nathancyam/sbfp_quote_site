function request(method) {
  return function(url, data, callback) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);
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
  };
}

var postRequest = request('POST');
var getRequest = request('GET');

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

(function () {
  var socket = io();

  socket.on('game:state_change', function (state) {
    console.log(state);
  });
  socket.emit('game:join', { id: 'player_' + Date.now(), name: 'Pat' });
})();

updateStatDOM();

(function () {
  Vue.component('select-node', {
    props: ['selectValue', 'selectOptions', 'nameValue'],
    template: '#tmpl-select',
    data: function () {
      return {
        name: this.nameValue,
        selected: this.selectValue,
        options: this.selectOptions
      }
    },
    methods: {
      onChange: function () {
        this.$emit('update', this.selected);
      }
    }
  });

  Vue.component('quote', {
    props: ['currentQuote'],
    template: '<p class="quote-text">{{ quote.text }}</p>',
    computed: {
      quote: function () {
        return this.currentQuote;
      }
    }
  });

  console.log(origins);

  new Vue({
    el: '#example',
    template: '#template',
    data: {
      person: 'matt',
      personValue: 'speaker',
      difficulty: 'hardmode',
      diffValue: 'difficulty',
      show: '007agentunderfire',
      showValue: 'show',
      peopleOptions: [
        { label: 'Liam', value: 'liam' },
        { label: 'Pat', value: 'pat' },
        { label: 'Matt', value: 'matt' },
        { label: 'Woolie', value: 'woolie' },
      ],
      diffOptions: [
        { label: 'Hard Mode', value: 'hardmode' },
        { label: 'Show Zaibatsu Member', value: 'person' },
        { label: 'Show Quote Source', value: 'show' },
      ],
      showOptions: origins,
      quote: {
        text: 'I am a quote',
        id: ''
      },
      score: 0,
    },
    methods: {
      updatePerson: function (person) {
        this.person = person;
      },
      updateDiff: function (diff) {
        this.difficulty = diff;
      },
      updateShow: function (show) {
        this.show = show;
      },
      submitAnswer: function (event) {
        event.preventDefault();
        var vm = this;
        postRequest('/guess', {
          id: this.quote.id,
          speaker: this.person,
          game: this.show,
        }, function (err, result) {
          vm.score = result.score;
        });
      }
    }
  });
})();
