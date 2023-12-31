var Deck = {
  cards: [],
  draw: function() {
    var card = this.cards.pop();
    if (!card && this.cards.length < 1) {
      this.reloadDeck();
      card = this.cards.pop();
    }
    return card;
  },
  reloadDeck: function() {
    var cards = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    var suits = [1, 2, 3, 4]
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < cards.length; j++) {
        var color = 1
        if (suits[i] % 2 == 0) {
          var color = 2
        }
        this.cards.push({
          color: this.translateColor(color),
          suit: this.translateSuit(suits[i]),
          value: this.translateValue(cards[j]),
          face: cards[j]
        });
      }
    }
    this.shuffle(this.cards);
  },
  shuffle: function(deck) {
    var i = 0;
    var j = 0;
    var temp = null;

    for (i = deck.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
  },
  translateSuit: function(suit) {
    switch (suit) {
      case 1:
        return "&#9829;"; //Hearts
      case 2:
        return "&#9824;"; //Spades
      case 3:
        return "&#9830;"; //Diamonds
      case 4:
        return "&#9827;"; //Clubs
    }
  },
  translateColor: function(color) {
    if (color == 1) {
      return "red";
    }
  },
  translateValue: function(value) {
    if (value == "A") {
      return 11;
    }
    if (parseInt(value) != parseInt(value)) {
      return 10;
    }
    return parseInt(value);
  }
};
var BlackJack = {
  done: false,
  player: {
    wins: 0,
    hand: [],
    currentValue: 0
  },
  dealer: {
    wins: 0,
    hand: [],
    currentValue: 0
  },
  getTotalGames: function() {
    return this.player.wins + this.dealer.wins
  },
  deal: function() {
    $('#bs-messages').empty()
    this.done = false;
    var card = {};
    this.player.hand = [];
    this.player.currentValue = 0;
    card = Deck.draw()
    this.player.currentValue += card.value;
    this.player.hand.push(card);
    card = Deck.draw()
    this.player.currentValue += card.value;
    this.player.hand.push(card);

    this.dealer.hand = [];
    this.dealer.currentValue = 0;
    card = Deck.draw()
    this.dealer.currentValue += card.value;
    this.dealer.hand.push(card);
    card = Deck.draw()
    this.dealer.currentValue += card.value;
    this.dealer.hand.push(card);
    this.printHands(['player', 'dealer']);
    this.checkStatus();
  },
  hit: function(playerType) {
    var card = {};
    var player = this[playerType];
    if (this.done) {
      return
    }
    if (player.hand.length < 5) {
      card = Deck.draw()
      player.currentValue += card.value;
      player.hand.push(card);
      this.printHands([playerType]);
    }
    if (playerType == "player") {
      this.checkStatus();
    } else {
      this.checkDealerStatus();
    }
  },
  stand: function() {
    if (this.done) {
      return
    }
    while (!this.done) {
      this.hit('dealer');
    }
  },
  printHands: function(players) {
    for (var i = 0; i < players.length; i++) {
      var player = this[players[i]];
      $("#bs-" + players[i] + "-hand").empty();
      for (var j = 0; j < this[players[i]].hand.length; j++) {
        var card = "<span class='bs-card bs-suit-" +
          player.hand[j].color +
          "'><div class='bs-card-top'>" +
          player.hand[j].face.concat(player.hand[j].suit) +
          "</div><div class='bs-card-suit'>" +
          player.hand[j].suit +
          "</div><div class='bs-card-bottom'>" +
          player.hand[j].face +
          player.hand[j].suit +
          "</div></span>";
        $("#bs-" + players[i] + "-hand").append(card);
      }
    }
  },
  checkDealerStatus: function() {
    var count = 0;
    for (var j = 0; j < this.dealer.hand.length; j++) {
      var card = this.dealer.hand[j];
      if (card.face == 'A' && (count + card.value) > 21) {
        count += 1;
      } else {
        count += card.value;
      }
    }
    if (count > 21) {
      $('#bs-player-wins').empty().append(++this.player.wins);
      $('#bs-messages').empty().append('You Win!').addClass("win");
      this.done = true;
      return
    }
    if (this.dealer.hand.length > 4) {
      $('#dealer-wins').empty().append(++this.dealer.wins);
      $('#messages').empty().append('You Lose');
      this.done = true;
      return
    }
    if (count == 21) {
      $('#bs-dealer-wins').empty().append(++this.dealer.wins);
      $('#bs-messages').empty().append('You Lose');
      this.done = true;
      return
    }
  },
  checkStatus: function() {
    var count = 0;
    for (var j = 0; j < this.player.hand.length; j++) {
      var card = this.player.hand[j];
      if (card.face == 'A' && (count + card.value) > 21) {
        count += 1;
      } else {
        count += card.value;
      }
    }
    if (count > 21) {
      $('#bs-dealer-wins').empty().append(++this.dealer.wins);
      $('#bs-messages').empty().append('You Busted!').addClass("bust");
      this.done = true;
      return
    }
    if (this.player.hand.length > 4) {
      $('#bs-player-wins').empty().append(++this.player.wins);
      $('#bs-messages').empty().append('You Win').addClass("win");
      this.done = true;
      return
    }
    if (count == 21) {
      $('#bs-player-wins').empty().append(++this.player.wins);
      $('#bs-messages').empty().append('You Win').addClass("win");
      this.done = true;
      return
    }
  }
};

BlackJack.deal();