//------------------Initializing variables and elements-----------------------------------
var elButtonShuffle = document.getElementById("ShuffleDeckButton");

var elListDeck = document.getElementById("DeckList");
var elTotalDeckCards = document.getElementById("totalDeckCards");
var elPlayerNameList = document.getElementById("PlayerNameList");
const strPlayerListNameElement = "PlayerListNameElement";

var elPlayerBody = document.getElementById("PlayersBody");
const strPlayerDivClass = "PlayerDiv";
const strPlayerNameClass = "PlayerName";
const strPlayerNumberClass = "PlayerNumber";
const strPlayersCardContainerClass = "PlayersCardContainer";

//Card html
const strPlayerCardDivClass = "PlayerCardDiv";
const strPlayerCardTitleClass = "PlayerCardTitle";
const strPlayerCardDescriptionTextClass = "PlayerCardDescriptionText";

const strStealModalPlayerName = "StealModalPlayerName";

var elAddPlayerButton = document.getElementById("AddPlayerButton");
var elAddPlayerTextField = document.getElementById("AddPlayerTextField");
var elStealModal = document.getElementById("StealModalContainer");
var elStealPlayerModal = document.getElementById("StealModalPlayerContainer");
var elStealModalCloseButton = document.getElementById("StealModalCloseButton");
var elStealModalPlayerTitle = document.getElementById("StealModalPlayerTitle");

const totalStartingCardHand = 5;

//=-----------------Main: Building game---------------------------------
//Testing the card class
console.log("testing the card builder obj")
var objCardManager = new CardManager(totalStartingCardHand);

//Adding cards to the deck
GenerateCards(objCardManager)

//Generating default players
objCardManager.addPlayer("Daniel");
objCardManager.addPlayer("Alex");
objCardManager.addPlayer("Rebecca");

//Initializing Game
objCardManager.startGame();

InitUI(objCardManager);

//=---------------------Element Listeners-----------------------------
elButtonShuffle.addEventListener("click", function(){
    objCardManager.shuffleDeck();
    RedrawCardsAndPlayersUI(false, true, objCardManager);
}, false);

elAddPlayerButton.addEventListener("click", function () {
    //Getting the new players name from the text field value to add a new player
    objCardManager.addPlayer(elAddPlayerTextField.value);

    //TODO this should also start dealing cards to newly added players, but the BEST solution for this is to have a pending game setup state (adding players) and then another stage
    //Where the game is actually being played. Don't need to rework how cards are dealt yet.
    AddPlayerUI(elAddPlayerTextField.value, objCardManager.getTotalPlayers() - 1);
    
    RedrawCardsAndPlayersUI(true, true, objCardManager);

    RedrawPlayerNameListUI();

    elAddPlayerTextField.value = "";
}, false);

elStealModalCloseButton.addEventListener("click", function() {
    elStealModal.style.display = "none";
}, false)

//=----------------------Card Functions-------------------------------
function GenerateCards(objCards)
{
    objCards.addNewCard("Drink", "Drink up!", 5);
    // -- Drink Punishing Cards
    //A curse card that be moved around, makes a player drink twice. You can stack curses on one player, playing curses on a new target removes all active curses.
    //Drink. Make someone drink
    objCards.addNewCard("Curse", "Place the curse card in front of any player. Double any drinks they take for the rest of the game.", 2)

    // -- Protection cards
    objCards.addNewCard("Protect", "Play this card to stop any drinking effect.", 5);

    // -- Drawing Cards
    objCards.addNewCard("Jumpy Frog", "Draw 2 Cards", 5, 0, 2);
    objCards.addNewCard("Gambler", "Place any number of cards from your hand into the deck. Draw the same number of cards. Shuffle", 2, 0, 1);

    // -- Stealing cards
    objCards.addNewCard("Steal", "Steal a random card from a player of your choice", 4, 1, 0);
    objCards.addNewCard("Baron", "Steal a random card from every other player", 2, 1, 0);

    // -- End Game Cards
    objCards.addNewCard("Blackout", "You lose if you have this card at the end of the game.", 1, 0, 0, true);
    objCards.addNewCard("Lucky Frog", "You win if you have this card at the end of the game.", 1, 0, 0, true);
}

//Adds buttons, cards, etc for each player and stores them in the element list
function InitUI(objCardManager)
{
    var listPlayers = objCardManager.playerList
    for (var iPlayer = 0; iPlayer < listPlayers.length; iPlayer++)
    {
        AddPlayerUI(listPlayers[iPlayer].getName(), iPlayer);
    }

    RedrawCardsAndPlayersUI(true, true, objCardManager);

    RedrawPlayerNameListUI();
}

function AddPlayerUI(strName, lngPlayerNumber)
{
    //================Creating base player UI
    var elPlayerDiv = document.createElement("div");
    elPlayerDiv.classList.add(strPlayerDivClass);

    var elPlayersCardContainer = document.createElement("div");
    elPlayersCardContainer.classList.add(strPlayersCardContainerClass);

    var elPlayerName = document.createElement("p");
    elPlayerName.textContent = strName;
    elPlayerName.classList.add(strPlayerNameClass)
    elPlayerDiv.appendChild(elPlayerName)

    //===============Creating base player buttons
    var elToggleVisibilityButton = document.createElement("button");
    elToggleVisibilityButton.textContent = "Hide";
    elToggleVisibilityButton.addEventListener('click', function(){
        //Toggles a players hand and details
        ToggleElementVisibility(elPlayersCardContainer, elToggleVisibilityButton, "flex");
    }, false);
    elPlayerDiv.appendChild(elToggleVisibilityButton)

    //Trigger drawing a card
    var elDrawCardButton = document.createElement("button");
    elDrawCardButton.textContent = "Draw Card";

    elDrawCardButton.addEventListener('click', function() {
        DrawCard(lngPlayerNumber);
    }, false);

    elPlayerDiv.appendChild(elDrawCardButton);

    //============= Steal 
    //to handle a card with steal, need to know which player to steal from then randomly pull a card from their hand
    var elStealCardButton = document.createElement("button");
    elStealCardButton.textContent = "Steal Card";

    elStealCardButton.addEventListener('click', function() {
        //Shows the stealing modal with players available to steal from
        RedrawStealModalUI(strName,lngPlayerNumber,false);

    }, false);

    elPlayerDiv.appendChild(elStealCardButton);
    //Adding player to the list of options to steal from
    
    var elStealFromPlayerName = document.createElement("p");
    elStealFromPlayerName.textContent = strName;
    elStealFromPlayerName.classList.add(strStealModalPlayerName);
    elStealPlayerModal.appendChild(elStealFromPlayerName);
    
    elStealFromPlayerName.addEventListener('click' ,function(event){
        //Steals a card and sends them back to the current player
        //TODO This will work since unique names will be enforced. But look for a more elegant solution
        let clickedElement = event.target;
        let strVictimPlayersName = clickedElement.innerText;
        let iVictimPlayer = objCardManager.findPlayerByName(strVictimPlayersName);

        let iThiefPlayer = objCardManager.getCurrentPlayer();
        
        console.log(iThiefPlayer + " is stealing from " + strVictimPlayersName + ": " + iVictimPlayer);

        objCardManager.stealCard(iThiefPlayer, iVictimPlayer);
        //We really need a state machine
        RedrawCardsAndPlayersUI(true, false, objCardManager);
        RedrawStealModalUI("", 0, true);
    }, false);

    //=============== End Turn
    var elNextPlayerButton = document.createElement("button");
    elNextPlayerButton.textContent = "End Turn";
    elNextPlayerButton.classList.add("NextPlayerButton");
    elPlayerDiv.appendChild(elNextPlayerButton);

    elNextPlayerButton.addEventListener('click', function(){
        console.log("Ending turn for player[" + objCardManager.getCurrentPlayer() + "]");
        objCardManager.nextPlayer();
        
        RedrawStealModalUI("",0,true);

        RedrawCardsAndPlayersUI(true, false, objCardManager);

        RedrawPlayerNameListUI();
    }, false);

    //Adding div for player cards
    
    //Adding card list to the player div
    elPlayerDiv.appendChild(elPlayersCardContainer);
    
    //Adding new player div to doc
    elPlayerBody.appendChild(elPlayerDiv);

    //This reliess on RedrawCards to add all of the card elements to this
}

function CreatePlayerCardUI(objPlayersCardHand, iCard)
{
    //Creating base card div
    var newCardDiv = document.createElement("div");
    newCardDiv.classList.add(strPlayerCardDivClass);

    //Adding title text to the card
    var cardText = document.createElement("p");
    cardText.textContent = objPlayersCardHand[iCard]._name();
    cardText.classList.add(strPlayerCardTitleClass);
    newCardDiv.appendChild(cardText);

    //Adding card description to the card
    var cardDescription = document.createElement("p");
    cardDescription.textContent = objPlayersCardHand[iCard]._details();
    cardDescription.classList.add(strPlayerCardDescriptionTextClass);
    newCardDiv.appendChild(cardDescription);
    return newCardDiv;
}

//Managing how cards are being drawn, this is a refresh UI function to redraw all card componenents for a player vs the deck\
function RedrawCardsAndPlayersUI(redrawPlayerList,
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

            //Updating the remaining card deck count
            elTotalDeckCards.innerText = listDeck.length;
    }
        
    if (redrawPlayerList){
        const elPlayersCardContainer = document.querySelectorAll("." + strPlayersCardContainerClass);
        var listPlayers = objCardManager.playerList
        
        //Redrawing player hands
        var iPlayer = 0;
        elPlayersCardContainer.forEach(elPlayersCardDiv => {
            var elPlayersDiv = GetPlayerDivElementByNumber(iPlayer);

            if (iPlayer === objCardManager.getCurrentPlayer())
            {
                //Redrawing hand for current player
                DeleteChildrenElements(elPlayersCardDiv);
                
                var listPlayerCards = listPlayers[iPlayer].getPlayersHand();
                for (var iPlayersCard = 0; iPlayersCard < listPlayerCards.length; iPlayersCard++){
                    let objPlayerCardDiv = CreatePlayerCardUI(listPlayerCards, iPlayersCard);
                    elPlayersCardDiv.appendChild(objPlayerCardDiv);
                    AddCardClickEvent(objPlayerCardDiv, listPlayers[iPlayer], iPlayersCard);
                }
                
                //Making sure player div is visible
                elPlayersDiv.style.display = "block";
            }else{
                //Hiding divs for the other players
                elPlayersDiv.style.display = "none";
            }
            iPlayer++;
        });
    }
}

function RedrawStealModalUI(strName,
    iCurrentPlayer,
    blnCloseModal)
{
    if (blnCloseModal){
        //Hiding the steal player div
        elStealModal.style.display = "none";
        return;
    }

    elStealModal.style.display = "inline";
    elStealModalPlayerTitle.innerText = strName;
    
    //Hide the player who opened the steal list as an available target
    for (var iPlayerName = 0; iPlayerName < elStealPlayerModal.children.length; iPlayerName++)
    {   
        if (iPlayerName === iCurrentPlayer)
            {
                elStealPlayerModal.children[iPlayerName].style.display = "none";
            }else{
                console.log(strName + " can steal from player: " + iPlayerName + ": " + elStealPlayerModal.children[iPlayerName].innerText);
            elStealPlayerModal.children[iPlayerName].style.display = "block";
        }
    }
}

function RedrawPlayerNameListUI()
{
    DeleteChildrenElements(elPlayerNameList);
    
    for (iPlayer = 0; iPlayer < objCardManager.getTotalPlayers(); iPlayer++){
        var elPlayerName = document.createElement("li");
        elPlayerName.classList.add(strPlayerListNameElement);

        let strNameText = objCardManager.getPlayerNameByIndex(iPlayer);
        if (iPlayer === objCardManager.getCurrentPlayer()) 
        {
            strNameText += " *";
        }

        elPlayerName.textContent = strNameText;
        elPlayerNameList.appendChild(elPlayerName);
    }
}

//Effect Functions
function AddCardClickEvent(objCardDivElement, objPlayer, iCard)
{
    //Getting card data from the player obj
    let objCardData = objPlayer.getPlayersHand()[iCard];

    if (objCardData._isPlayDisabled()) return;

    objCardDivElement.addEventListener('click', function()
    {
        let iCurrentPlayer = objCardManager.getCurrentPlayer();
        let strCurrentName = objCardManager.getPlayerNameByIndex(iCurrentPlayer);

        if (objCardData._totalDrawCards() > 0)
        {
            //Triggering draw effect
            for(let i = 0; i < objCardData._totalDrawCards(); i++)
            {
                DrawCard(iCurrentPlayer);
            }
        }

        if (objCardData._totalStealCards() > 0)
        {
            //Triggering steal effect
            //TODO need to support the modal having a total amount of tries
            //TODO need to make modal generic, and support multiple interactions (make it a generic player list modal function)
            console.log("Triggering the steal cards effect for card: " + objCardData._name());
            RedrawStealModalUI(strCurrentName, iCurrentPlayer, false);
        }

        //Moving card from hand to table
        objPlayer.playiCard(iCard);

        RedrawCardsAndPlayersUI(true, false, objCardManager);
    }, false);
}

function DrawCard(iPlayerNumber) {
    //Draws a card for a player
    objCardManager.drawCard(iPlayerNumber);
    RedrawCardsAndPlayersUI(true, true, objCardManager);
}

//Generic functions
function DeleteChildrenElements(parentElement)
{
    while (parentElement.firstChild) {
        parentElement.firstChild.remove()
    }
}

function ToggleElementVisibility(objHtmlElement, objButtonElement, strDisplayShow) {
    if (objHtmlElement.style.display === "none") {
        objHtmlElement.style.display = strDisplayShow;
        objButtonElement.textContent = "Hide";
    } else {
        objHtmlElement.style.display = "none";
        objButtonElement.textContent = "Show";
    }
}

function GetPlayerDivElementByNumber(iGetPlayer)
{
    var elPlayerDivs = document.querySelectorAll("."+strPlayerDivClass);
    
    for(iPlayer = 0; iPlayer < elPlayerDivs.length; iPlayer++)
    {
        if (iPlayer === iGetPlayer)
        {
            return elPlayerDivs[iPlayer];
        }
    }
    throw new Error("Could not find a player div for player: " + iGetPlayer + ". Only " + elPlayerDivs.length + "Players are available.");
}