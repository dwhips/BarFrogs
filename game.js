// import CardBuilder from "./CardClass";

var button = document.getElementById('GenCardButton');
var cardText = document.getElementById('CardText');

//TODO make a class for cards
//card name
//card details
//count
// const cardList = ['test1', 'test2', 'test3', 'test4', '5', '6', '7'];

//=--------------------------------------------------
//Testing the card class
console.log("testing the card builder obj")
var objCardManager = new CardManager(5);

GenerateCards(objCardManager)

objCardManager.addPlayer("Daniel");
objCardManager.addPlayer("Alex");

objCardManager.startGame();
// console.log(cardList.length)
// CardBuilder objCards;

//=--------------------------------------------------

button.addEventListener('click', function() {
    // cardText.innerText = GetRandomCard();
    cardText.innerText = objCardManager.drawCard();
}, false);


//Functions are more for testing //
function GetRandomCardIndex()
{
    console.log("card length" + cardList.length);
    return Math.floor(Math.random() * cardList.length);
}

function GetRandomCard()
{
    console.log(GetRandomCardIndex());
    console.log(cardList[GetRandomCardIndex()]);
    return cardList[GetRandomCardIndex()];
}

function GenerateCards(objCards)
{
    objCards.addCard("Sleep", "You can take a nap", 5);
    objCards.addCard("Firebolt", "Do 5 damage", 5);
    objCards.addCard("Drink", "Drink up!", 5);
    // -- Drink Punishing Cards
    //A curse card that be moved around, makes a player drink twice. You can stack curses on one player, playing curses on a new target removes all active curses.
    //Drink. Make someone drink

    // -- Protection cards

    // -- Drawing Cards

    // -- Stealing cards

    //////
}