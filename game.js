//------------------Initializing variables and elements-----------------------------------
var elButtonDrawCard = document.getElementById("GenCardButton");
var elButtonRefreshUI = document.getElementById("RefreshCardsUIButton");
var elButtonShuffle = document.getElementById("ShuffleDeckButton");

var elCardText = document.getElementById("CardText");

var elListPlayers = document.getElementById("PlayerList");
var elListDeck = document.getElementById("DeckList");

//=-----------------Main: Building game---------------------------------
//Testing the card class
console.log("testing the card builder obj")
var objCardManager = new CardManager(5);

//Adding cards to the deck
GenerateCards(objCardManager)

//Generating players
objCardManager.addPlayer("Daniel");
objCardManager.addPlayer("Alex");
objCardManager.addPlayer("Tim");

//Initialiing gmae
objCardManager.startGame();
RedrawCards(true, true, objCardManager);
// console.log(cardList.length)
// CardBuilder objCards;


//=---------------------Element Listeners-----------------------------

//Trigger drawing a card
elButtonDrawCard.addEventListener('click', function() {
    elCardText.innerText = objCardManager.drawCard();
    RedrawCards(true, true, objCardManager);
}, false);

//Trigger UI update
elButtonRefreshUI.addEventListener('click', function(){
    RedrawCards(true, true, objCardManager);
}, false);

elButtonShuffle.addEventListener("click", function(){
    objCardManager.shuffleDeck();
    RedrawCards(false, true, objCardManager);
}, false)
//=----------------------Card Functions-------------------------------
function GenerateCards(objCards)
{
    objCards.addCard("Sleep", "You can take a nap", 5);
    objCards.addCard("Firebolt", "Do 5 damage", 5);
    objCards.addCard("Drink", "Drink up!", 5);
    // -- Drink Punishing Cards
    //A curse card that be moved around, makes a player drink twice. You can stack curses on one player, playing curses on a new target removes all active curses.
    //Drink. Make someone drink
    objCards.addCard("Curse", "Place the curse card in front of any player. Double any drinks they take for the rest of the game.", 2)

    // -- Protection cards
    objCards.addCard("Protect", "Play this card to stop any drinking effect.", 5);

    // -- Drawing Cards
    objCards.addCard("Gambler", "Place any number of cards from your hand into the deck. Draw the same number of cards. Shuffle", 2);

    // -- Stealing cards
    objCards.addCard("Steal", "Take a random card from a player of your choice", 4);
    objCards.addCard("Baron", "Take a random card from every other player", 2);
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
   
            //Redrawing deck cards
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
        
    if (redrawPlayerList){
        DeleteChildrenElements(elListPlayers);
        
        var listPlayers = objCardManager.playerList
    
        //Redrawing player hands
        for (var iPlayer = 0; iPlayer < listPlayers.length; iPlayer++)
        {
            //TODO there is an issue where the player cards are being removed each update. This does not happen for the deck printing
            //There is someting in the player class deleting cards from their hand.
            var listPlayerCards = listPlayers[iPlayer].getPlayersHand()
            for (var iPlayersCard = 0; iPlayersCard < listPlayerCards.length; iPlayersCard++)
            {
                //adding new list elements
                var newCardListItem = document.createElement("li");
                newCardListItem.textContent = listPlayers[iPlayer].getName() + ": " + listPlayerCards[iPlayersCard]._name() + "-"+ listPlayerCards[iPlayersCard]._details();
                
                elListPlayers.appendChild(newCardListItem);
            }
    
            //adding spacing for the final card in a players list
            var newCardListItem = document.createElement("li");
            newCardListItem.textContent = "";
            elListPlayers.appendChild(newCardListItem);
        }
    }
}

function DeleteChildrenElements(parentElement)
{
    while (parentElement.firstChild) {
        parentElement.firstChild.remove()
    }
}