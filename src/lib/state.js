module.exports = {
  peopleOptions: {
    selectedValue: 'matt',
    nameAttr: 'speaker',
    options: [
      { label: 'Liam', value: 'liam' },
      { label: 'Pat', value: 'pat' },
      { label: 'Matt', value: 'matt' },
      { label: 'Woolie', value: 'woolie' },
    ]
  },
  showOptions: {
    selectedValue: '007agentunderfire',
    nameAttr: 'show',
    options: []
  },
  difficultyOptions: {
    selectedValue: 'show',
    nameAttr: 'difficulty',
    options: [
      { label: 'Hard Mode', value: 'hardmode'},
      { label: 'Show Zaibatsu Member', value: 'person' },
      { label: 'Show Quote Source', value: 'show' },
    ]
  },
  quote: {},
  correctAnswer: false,
  player: {
    id: '',
    name: '',
    score: 0
  },
  scoreboard: {
    players: []
  },
  challengers: []
};
