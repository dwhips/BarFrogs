const strPlayerListNameElement = "PlayerListNameElement";

const strPlayerDivClass = "PlayerDiv";
const strPlayerNameClass = "PlayerName";
const strPlayerNumberClass = "PlayerNumber";
const strPlayersCardContainerClass = "PlayersCardContainer";

//Card html
const strPlayerCardDivClass = "PlayerCardDiv";
const strPlayerCardTitleClass = "PlayerCardTitle";
const strPlayerCardDescriptionTextClass = "PlayerCardDescriptionText";

//Modal Html
const strStealModalPlayerName = "StealModalPlayerName";

//The goal of this class is to redraw UI elements and not to build/create elements

//Managing how cards are being drawn, this is a refresh UI function to redraw all card componenents for a player vs the deck\
function RebuildDeck(objCardManager,
    elDeckList
){
    DeleteChildrenElements(elDeckList);

    //Redrawing deck cards
    var listDeck = objCardManager.deckCardList;
    for (var iDeckCard = 0; iDeckCard < listDeck.length; iDeckCard++)
    {
        //adding new list elements to deck (not visible. Will need this for some card abilities evetually)
        var newCardListItem = document.createElement("li");
        newCardListItem.textContent = listDeck[iDeckCard]._name() + "-"+ listDeck[iDeckCard]._details();

        elDeckList.appendChild(newCardListItem);
    }

    elTotalDeckCards.innerText = listDeck.length;
}

function RebuildPlayersHand(objCardManager)
{
        const elPlayersCardContainer = document.querySelectorAll("." + strPlayersCardContainerClass);
        var listPlayers = objCardManager.playerList

        //Redrawing player hands
        var iPlayer = 0;
        elPlayersCardContainer.forEach(elPlayersCardDiv => {
            var elPlayersDiv = GetClassElementByIndex(iPlayer, strPlayerDivClass);

            if (iPlayer === objCardManager.getCurrentPlayerIndex())
            {
                //Redrawing hand for current player
                DeleteChildrenElements(elPlayersCardDiv);

                var listPlayerCards = listPlayers[iPlayer].getPlayersHand();
                for (var iPlayersCard = 0; iPlayersCard < listPlayerCards.length; iPlayersCard++){
                    let objPlayerCardDiv = CreatePlayerCardUI(listPlayerCards, iPlayersCard);
                    elPlayersCardDiv.appendChild(objPlayerCardDiv);
                    //Please note. game manager class handles setting events triggered when the card is clicked
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

    //Checking if the card can be selected
    if (objPlayersCardHand[iCard]._isSelectable())
    {
       newCardDiv.style.outlineColor = 'red';
    } else {
        newCardDiv.style.outlineColor = 'gray';
    }

    return newCardDiv;
}