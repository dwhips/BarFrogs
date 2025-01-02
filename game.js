// import CardBuilder from "./CardClass";

var elButtonDrawCard = document.getElementById('GenCardButton');
var elButtonRefreshUI = document.getElementById('RefreshCardsUi');
var elCardText = document.getElementById('CardText');

var elListPlayers = document.getElementById('PlayerList');
var elListDeck = document.getElementById('DeckList');

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

//Trigger drawing a card
elButtonDrawCard.addEventListener('click', function() {
    // cardText.innerText = GetRandomCard();
    elCardText.innerText = objCardManager.drawCard();
}, false);

//Trigger UI update
elButtonRefreshUI.addEventListener('click', function(){
    RedrawCards(true, true, objCardManager);
}, false);


// //Functions are more for testing //
// function GetRandomCardIndex()
// {
//     console.log("card length" + cardList.length);
//     return Math.floor(Math.random() * cardList.length);
// }

// function GetRandomCard()
// {
//     console.log(GetRandomCardIndex());
//     console.log(cardList[GetRandomCardIndex()]);
//     return cardList[GetRandomCardIndex()];
// }

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



//Managing how text is being updated
//TODO for now just have this linked to a button. But down the line, call this function on event updates.
function RedrawCards(redrawPlayerList,
    redrawDeckList,
    objCardManager
)
{
    if (redrawDeckList)
    {
        DeleteChildrenElements(elListDeck);
    }
        
    if (redrawPlayerList){
        DeleteChildrenElements(elListPlayers);
    }
        
    var listPlayers = objCardManager.playerList
    // TODO have a UL for players
    //TODO have another UL for the deck
        //Both of them will have LI with card details printed


    for (var iPlayer = 0; iPlayer < listPlayers.length; iPlayer++)
    {
        var listPlayerCards = listPlayers[iPlayer].getPlayersHand()
        for (var iPlayersCard = 0; iPlayersCard < listPlayerCards.length; iPlayersCard++)
        {
            //adding new list elements
            var newCardListItem = document.createElement("li");
            newCardListItem.textContent = listPlayers[iPlayer].getName() + ": " + listPlayerCards[iPlayersCard]._name() + "-"+ listPlayerCards[iPlayersCard]._details(); //TODO add cards 
            
            elListPlayers.appendChild(newCardListItem);
        }

        if (iPlayer == listPlayerCards.length--)
        {
            //adding spacing for the final card in a players list
            var newCardListItem = document.createElement("li");
            newCardListItem.textContent = "test end>>>\n";
            elListPlayers.appendChild(newCardListItem);
        }
    }

    // TODO iterate through the deck list
    var listDeck = objCardManager.deckCardList;
    for (var iDeckCard = 0; iDeckCard < listDeck.length; iDeckCard++)
    {
        //adding new list elements to deck
        var newCardListItem = document.createElement("li");
        newCardListItem.textContent = listDeck[iDeckCard]._name() + "-"+ listDeck[iDeckCard]._details(); 
        
        elListDeck.appendChild(newCardListItem);
        console.log("printing test" + iDeckCard);
    }

}

function DeleteChildrenElements(parentElement)
{
    while (parentElement.firstChild) {
        parentElement.firstChild.remove()
    }
}