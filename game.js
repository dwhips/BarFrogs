//------------------Initializing variables and elements-----------------------------------
var elButtonShuffle = document.getElementById("ShuffleDeckButton");

var elListDeck = document.getElementById("DeckList");

var elPlayerBody = document.getElementById("PlayersBody");
const strPlayerDivClass = "PlayerDiv";
const strPlayerNameClass = "PlayerName";
const strPlayerNumberClass = "PlayerNumber";
const strPlayersCardDivClass = "PlayersCardDiv";

var elAddPlayerButton = document.getElementById("AddPlayerButton");
var elAddPlayerTextField = document.getElementById("AddPlayerTextField");

const totalStartingCardHand = 5;

//=-----------------Main: Building game---------------------------------
//Testing the card class
console.log("testing the card builder obj")
var objCardManager = new CardManager(totalStartingCardHand);

//Adding cards to the deck
GenerateCards(objCardManager)

//Generating players
objCardManager.addPlayer("Daniel");
objCardManager.addPlayer("Alex");

//Initializing Game
objCardManager.startGame();

InitUI(objCardManager);

//=---------------------Element Listeners-----------------------------
elButtonShuffle.addEventListener("click", function(){
    objCardManager.shuffleDeck();
    RedrawCards(false, true, objCardManager);
}, false);

elAddPlayerButton.addEventListener("click", function () {
    //Getting the new players name from the text field value to add a new player
    objCardManager.addPlayer(elAddPlayerTextField.value);

    //TODO this should also start dealing cards to newly added players, but the BEST solution for this is to have a pending game setup state (adding players) and then another stage
    //Where the game is actually being played. Don't need to rework how cards are dealt yet.
    AddPlayerUI(elAddPlayerTextField.value, objCardManager.getTotalPlayers() - 1);
    
    RedrawCards(true, true, objCardManager);
}, false);

//=----------------------Card Functions-------------------------------
function GenerateCards(objCards)
{
    objCards.addNewCard("Sleep", "You can take a nap", 5);
    objCards.addNewCard("Firebolt", "Do 5 damage", 5);
    objCards.addNewCard("Drink", "Drink up!", 5);
    // -- Drink Punishing Cards
    //A curse card that be moved around, makes a player drink twice. You can stack curses on one player, playing curses on a new target removes all active curses.
    //Drink. Make someone drink
    objCards.addNewCard("Curse", "Place the curse card in front of any player. Double any drinks they take for the rest of the game.", 2)

    // -- Protection cards
    objCards.addNewCard("Protect", "Play this card to stop any drinking effect.", 5);

    // -- Drawing Cards
    objCards.addNewCard("Gambler", "Place any number of cards from your hand into the deck. Draw the same number of cards. Shuffle", 2);

    // -- Stealing cards
    objCards.addNewCard("Steal", "Take a random card from a player of your choice", 4);
    objCards.addNewCard("Baron", "Take a random card from every other player", 2);
}

//Adds buttons, cards, etc for each player and stores them in the element list
function InitUI(objCardManager)
{
    var listPlayers = objCardManager.playerList
    for (var iPlayer = 0; iPlayer < listPlayers.length; iPlayer++)
    {
        AddPlayerUI(listPlayers[iPlayer].getName(), iPlayer);
    }

    RedrawCards(true, true, objCardManager);
}

function AddPlayerUI(strName, lngPlayerNumber)
{
    //Creating base player UI
    var elPlayerDiv = document.createElement("div");
    elPlayerDiv.classList.add(strPlayerDivClass);

    var elPlayersCardDiv = document.createElement("div");
    elPlayersCardDiv.classList.add(strPlayersCardDivClass);
    
    var elPlayerName = document.createElement("p");
    elPlayerName.textContent = lngPlayerNumber + ". " + strName;
    elPlayerName.classList.add(strPlayerNameClass)
    elPlayerDiv.appendChild(elPlayerName)

    //Creating base player buttons
    var elToggleVisibilityButton = document.createElement("button");
    elToggleVisibilityButton.textContent = "Hide";
    elToggleVisibilityButton.addEventListener('click', function(){
        ToggleElementVisibility(elPlayersCardDiv, elToggleVisibilityButton);
    }, false);
    elPlayerDiv.appendChild(elToggleVisibilityButton)

    //TODO is there a better way to track a players number?
    // var elPlayerNumber = document.createElement("p");
    // elPlayerNumber.textContent = lngPlayerNumber;
    // elPlayerNumber.classList.add(strPlayerNumberClass);
    // elPlayerDiv.appendChild(elPlayerNumber);

    //Trigger drawing a card
    var elDrawCardButton = document.createElement("button");
    elDrawCardButton.textContent = "Draw Card";

    elDrawCardButton.addEventListener('click', function() {
        objCardManager.drawCard(lngPlayerNumber);
        RedrawCards(true, true, objCardManager);
    }, false);

    elPlayerDiv.appendChild(elDrawCardButton);

    //TODO add a steal button!!

    //Adding div for player cards
    //This relys on RedrawCards to add all of the card elements to this
    
    //Adding card list to the player div
    elPlayerDiv.appendChild(elPlayersCardDiv);
    
    //Adding new player div to doc
    elPlayerBody.appendChild(elPlayerDiv);
}

function CreatePlayerCardUI(objPlayersCardHand, iCard)
{
    var newCardListItem = document.createElement("p");
    newCardListItem.textContent = iCard +". " + objPlayersCardHand[iCard]._name() + ": "+ objPlayersCardHand[iCard]._details();
    return newCardListItem;
}

//Managing how cards are being drawn, this is a refresh UI function to redraw all card componenents for a player vs the deck\

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
            }
    }
        
    if (redrawPlayerList){
        const elPlayersCardDivList = document.querySelectorAll("." + strPlayersCardDivClass);
        var listPlayers = objCardManager.playerList
        
        
        //Redrawing player hands

        // Iterate over the elements
        //TODO this might not be safe it its out of sync with i player
        var iPlayer = 0;
        elPlayersCardDivList.forEach(elPlayersCardDiv => {
            DeleteChildrenElements(elPlayersCardDiv);

            var listPlayerCards = listPlayers[iPlayer].getPlayersHand();
            for (var iPlayersCard = 0; iPlayersCard < listPlayerCards.length; iPlayersCard++){
                elPlayersCardDiv.appendChild(CreatePlayerCardUI(listPlayerCards, iPlayersCard));
            }
            iPlayer++;
        });
    }
}

//Generic functions

function DeleteChildrenElements(parentElement)
{
    while (parentElement.firstChild) {
        parentElement.firstChild.remove()
    }
}

function ToggleElementVisibility(objHtmlElement, objButtonElement) {
    if (objHtmlElement.style.display === "none") {
        objHtmlElement.style.display = "block";
        objButtonElement.textContent = "Hide";
    } else {
        objHtmlElement.style.display = "none";
        objButtonElement.textContent = "Show";
    }
  }