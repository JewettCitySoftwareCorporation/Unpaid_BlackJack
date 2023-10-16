"use strict";
/*Please view on my GitHub: https://github.com/matthewtesterman/black-jack
*/
/*Entry Point*/
class Driver {
    constructor() { }
    main(imagePth) {
        var game = new Game(imagePth);
        game.setup();
        game.run();
    }
}
/*Game Controller*/
class Game {
    constructor(imgPath) {
        this.imgPath = imgPath;
    }
    setup() {
        //get a new deck and shuffle it.
        this.deck = new Deck();
        this.deck.shuffle();
        //Create two hands: dealer and player
        this.playerHand = new Hand();
        this.dealerHand = new Hand();
        //draw 1 cards for dealer and 2 for player's hand
        this.playerHand.addCard(this.deck.drawCard());
        this.playerHand.addCard(this.deck.drawCard());
        this.dealerHand.addCard(this.deck.drawCard());
        //Create new View
        this.view = new View(this.dealerHand, this.playerHand, this.imgPath);
        this.playerHand.calcTotalValue();
        this.dealerHand.calcTotalValue();
        this.view.update();
        this.view.unlockButtons();
    }
    run() {
        //get in local scope for event handlers.
        var currentGame = this;
        //Event listener for hit me button.
        document.getElementById('hitMe').addEventListener('click', function (e) {
            currentGame.view.lockButtons();
            //  $('button').attr('disabled',true);
            e.preventDefault();
            currentGame.hitMe(currentGame.playerHand);
            //check if checkBus
            currentGame.playerHand.calcTotalValue();
            var totalValue = currentGame.playerHand.getTotalValue;
            currentGame.view.update();
            if (currentGame.isBust(totalValue)) {
                currentGame.view.showPopUp('lose', 'Bust!');
            }
            else {
                currentGame.view.unlockButtons();
            }
        });
        //Stand Button listener
        document.getElementById('stand').addEventListener('click', function (e) {
            currentGame.view.lockButtons();
            e.preventDefault();
            currentGame.dealersPlay(currentGame);
        });
        //Retry Button listener
        $('.retry').click(function (e) {
            currentGame.view.lockButtons();
            e.preventDefault();
            currentGame.restart(currentGame);
        });
        //both hands are already drawn. THe first question that comes is: stand or hitme or surrender.
        this.view.showChoices();
        //Update the views score and other stuff.
        this.view.update();
    }
    /*This method deals with the Dealers play*/
    dealersPlay(currentGame) {
        var drawnCard = currentGame.deck.drawCard();
        var drawnCardFace = drawnCard.getFaceValue + "" + drawnCard.getSuite; //get suit and value of card in string type
        currentGame.dealerHand.addCard(drawnCard); //draw 2nd card.
        currentGame.dealerHand.calcTotalValue();
        currentGame.view.update(); //show 2nd card.
        while (currentGame.dealerHand.getTotalValue < 17) {
            var drawnCard = currentGame.deck.drawCard();
            var drawnCardFace = drawnCard.getFaceValue + "" + drawnCard.getSuite; //get suit and value of card in string type
            currentGame.dealerHand.addCard(drawnCard); //draw 2nd card.
            currentGame.dealerHand.calcTotalValue();
            currentGame.view.update();
        }
        if (currentGame.dealerHand.getTotalValue > 21) {
            currentGame.view.showPopUp('win', 'Dealer went bust! You Win!');
        }
        else if (currentGame.dealerHand.getTotalValue === currentGame.playerHand.getTotalValue) {
            currentGame.view.showPopUp('tie', 'You both tie!');
        }
        else if (currentGame.dealerHand.getTotalValue > currentGame.playerHand.getTotalValue) {
            currentGame.view.showPopUp('lose', 'You lose!');
        }
        else if (currentGame.dealerHand.getTotalValue < currentGame.playerHand.getTotalValue) {
            currentGame.view.showPopUp('win', 'Congratulations! You are a winner!');
        }
    }
    //Purpose is to draw another card from deck and into that hand.
    hitMe(currentHand) {
        var drawnCard = this.deck.drawCard();
        currentHand.addCard(drawnCard);
        this.playerHand.calcTotalValue();
        this.view.update();
    }
    /*Check if went over 21.*/
    isBust(totalValue) {
        if (totalValue > 21) {
            return true;
        }
        else {
            return false;
        }
    }
    restart(currentGame) {
        //Free Memory
        currentGame.playerHand = null;
        currentGame.dealerHand = null;
        currentGame.deck = null;
        currentGame.view.resetView();
        currentGame.setup();
    }
}
class Deck {
    constructor() {
        this.cards = [
            new Card("A", "Spades"),
            new Card("K", "Spades"),
            new Card("Q", "Spades"),
            new Card("J", "Spades"),
            new Card("10", "Spades"),
            new Card("9", "Spades"),
            new Card("8", "Spades"),
            new Card("7", "Spades"),
            new Card("6", "Spades"),
            new Card("5", "Spades"),
            new Card("4", "Spades"),
            new Card("3", "Spades"),
            new Card("2", "Spades"),
            new Card("A", "Clubs"),
            new Card("K", "Clubs"),
            new Card("Q", "Clubs"),
            new Card("J", "Clubs"),
            new Card("10", "Clubs"),
            new Card("9", "Clubs"),
            new Card("8", "Clubs"),
            new Card("7", "Clubs"),
            new Card("6", "Clubs"),
            new Card("5", "Clubs"),
            new Card("4", "Clubs"),
            new Card("3", "Clubs"),
            new Card("2", "Clubs"),
            new Card("A", "Diamonds"),
            new Card("K", "Diamonds"),
            new Card("Q", "Diamonds"),
            new Card("J", "Diamonds"),
            new Card("10", "Diamonds"),
            new Card("9", "Diamonds"),
            new Card("8", "Diamonds"),
            new Card("7", "Diamonds"),
            new Card("6", "Diamonds"),
            new Card("5", "Diamonds"),
            new Card("4", "Diamonds"),
            new Card("3", "Diamonds"),
            new Card("2", "Diamonds"),
            new Card("A", "Hearts"),
            new Card("K", "Hearts"),
            new Card("Q", "Hearts"),
            new Card("J", "Hearts"),
            new Card("10", "Hearts"),
            new Card("9", "Hearts"),
            new Card("8", "Hearts"),
            new Card("7", "Hearts"),
            new Card("6", "Hearts"),
            new Card("5", "Hearts"),
            new Card("4", "Hearts"),
            new Card("3", "Hearts"),
            new Card("2", "Hearts"),
        ];
    }
    shuffle() {
        var j, x, i;
        for (i = this.cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = x;
        }
    }
    get getDeck() {
        return this.cards;
    }
    /*
     * Will take the top card.
    */
    drawCard() {
        var drawnCard = this.cards[0]; //Get top Card from deck
        this.cards.splice(0, 1); //remove top card from pile
        return drawnCard;
    }
}
class Hand {
    constructor() {
        this.hand = [];
        this.handValue = 0;
    }
    /* Sum all the values of the hand. */
    calcTotalValue() {
        this.handValue = 0;
        for (var i = 0; i <= this.hand.length - 1; i++) {
            var value = this.hand[i].getFaceValue;
            if (!isNaN(parseInt(value))) {
                this.handValue += parseInt(value);
            }
            else if (value === 'J' || value === 'Q' || value === 'K') {
                this.handValue += 10;
            }
            else if (value === 'A') {
                this.handValue += 11;
            }
        }
    }
    /* Add Card to the Hand*/
    addCard(card) {
        this.hand.push(card);
    }
    /* Get the Cards from the hand*/
    get getHand() {
        return this.hand;
    }
    /* Get the sum of all the cards in the hand */
    get getTotalValue() {
        return this.handValue;
    }
}
class Card {
    constructor(faceValue, suite) {
        this.faceValue = faceValue;
        this.suite = suite;
    }
    get getFaceValue() {
        return this.faceValue;
    }
    get getSuite() {
        return this.suite;
    }
}
class View {
    constructor(dealerHand, playerHand, imgPath) {
        this.dealerHand = dealerHand;
        this.playerHand = playerHand;
        this.imgPath = imgPath;
    }
    update() {
        this.updateCards();
        this.updateScores();
    }
    /*Update the Scorew*/
    updateScores() {
        document.getElementById('player-score').innerHTML = this.playerHand.getTotalValue + "";
        document.getElementById('dealer-score').innerHTML = this.dealerHand.getTotalValue + "";
    }
    /* Iterates through both dealer and player hands and updates the view based on their hands  */
    updateCards() {
        var htmlVal = "";
        var playerCards = this.playerHand.getHand;
        var dealerCards = this.dealerHand.getHand;
        for (var i = 0; i < playerCards.length; i++) {
            var cardName = playerCards[i].getFaceValue + playerCards[i].getSuite;
            htmlVal += "<img src='" + this.imgPath + cardName + ".png' alt='" + cardName + "' class='img-fluid' />";
        }
        document.getElementById('player-hand').innerHTML = htmlVal;
        htmlVal = "";
        for (var i = 0; i < dealerCards.length; i++) {
            var cardName = dealerCards[i].getFaceValue + dealerCards[i].getSuite;
            htmlVal += "<img src='" + this.imgPath + cardName + ".png' alt='" + cardName + "' class='img-fluid'/>";
            //If this is the first round then only show one card for dealer and 2nd being a card turned down
            if (dealerCards.length === 1) {
                htmlVal += "<img src='" + this.imgPath + "card.png' alt='cover' class='img-fluid' />";
            }
        }
        document.getElementById('dealer-hand').innerHTML = htmlVal;
        htmlVal = "";
    }
    clearGame() {
        //remove cards from dealer and player
        //
    }
    showChoices() {
        document.getElementById('choice').style.display = 'block';
    }
    /*Show Pop Up*/
    showPopUp(type, message) {
        if (type === "tie") {
            $('#push-modal button').removeAttr('disabled');
            $('#push-modal').fadeIn(2000);
            $('#push-modal .message').html(message);
        }
        else if (type === "win") {
            $('#winner-modal button').removeAttr('disabled');
            $('#winner-modal').fadeIn(2000);
            $('#winner-modal .message').html(message);
        }
        else if (type === "lose") {
            $('#loose-modal button').removeAttr('disabled');
            $('#loose-modal').fadeIn(2000);
            $('#loose-modal .message').html(message);
        }
    }
    /*Hide Pop Ups*/
    hidePopUp() {
        $('#push-modal').css('display', 'none');
        $('#push-modal button').removeAttr('disabled');
        $('#winner-modal button').removeAttr('disabled');
        $('#winner-modal').css('display', 'none');
        $('#loose-modal button').removeAttr('disabled');
        $('#loose-modal').css('display', 'none');
    }
    /*Reset View*/
    resetView() {
        this.hidePopUp();
    }
    lockButtons() {
        $('button').prop('disabled', true);
    }
    unlockButtons() {
        $('button').removeAttr('disabled');
    }
}
var imagePath = "https://www.matthewtesterman.com/img/"; //path to card images
//start App
var driver = new Driver();
driver.main(imagePath);