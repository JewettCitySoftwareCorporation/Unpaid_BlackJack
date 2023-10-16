'use strict';

    let vm = new Vue({
      el: '#app',
      data() {
        return {
          player: [], // player hands
          dealer: [], // dealer hands
          deck: [],
          playing: false,
          suits: ["c", "s", "h", "d"],
          ranks: ["a", "2", "3", "4", "5", "6", "7", "8", "9", "t", "j", "q", "k"],
          cardback: "poker-back-heartstone",
          score: 0,
          msgStr: "",
          msgColor: "info",
        };
      },
      computed: {
        playerScore() {
          return this.calcScore(this.player);
        },
        dealerScore() {
          return this.calcScore(this.dealer);
        },
      },
      mounted() {
        this.deal();
      },
      methods: {
        newDeck() {
          this.deck = [];
          this.suits.forEach(function(suit) {
            this.ranks.forEach(function(rank) {
              this.deck.push(suit+rank);
            }, this);
          }, this);
          this.deck = this.shuffle(this.deck);
          // console.log(this.deck);
        },
        shuffle(v) {
          for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
            return v;
        },
        hit() {
          if(!this.playing) {
            this.msg("Click <strong>Deal</strong> button to restart.");
            return;
          }
          if( this.playerScore <= 21 )
            this.player.push( this.deck.pop() );
          if(this.playerScore > 21)
            this.msg("<strong>Player</strong> have busted", 'warning');
        },
        stand() {
          if(!this.playing) {
            this.msg("Click <strong>Deal</strong> button to restart.");
            return;
          }
          if(this.playerScore <= 21)
            while(this.dealerScore < 17 || this.dealerScore < Math.min(this.playerScore, 21))
              this.dealer.push(this.deck.pop());
          this.playing = false;

          let playerWin = (this.playerScore <= 21 && this.dealerScore < this.playerScore || this.dealerScore > 21);
          if(playerWin) {
            this.score++;
            this.msg('<strong>Player</strong> wins.', 'success');
          } else {
            this.score--;
            this.msg('<strong>Dealer</strong> wins.', 'danger');
          }
        },
        deal() {
          this.newDeck();
          this.player = [];
          this.dealer = [];
          for(let i=0; i<2; i++) {
            this.player.push( this.deck.pop() );
            this.dealer.push( this.deck.pop() );
          }

          if(this.playing) {
            this.score--;
            this.msg("<strong>Player</strong> lose. <strong>Hit</strong> or <strong>stand</strong>?", "success");
          } else {
            this.playing = true;
            this.msg("<strong>Hit</strong> or <strong>stand</strong>?");
          }
        },
        calcScore(hands) {
          let score = 0;
          let ace = false;
          hands.forEach(function(card) {
            score += Math.min(10, this.ranks.indexOf(card[1])+1);
            if(card[1] == 'a')
              ace = true;
          }, this);
          if(ace && score <= 11)
            score += 10;
          if(score < 21 && hands.length > 4)
            score = 21;
          return score;
        },
        msg(str, color = "info") {
          this.msgStr = str;
          this.msgColor = color;
        },
      },
    });