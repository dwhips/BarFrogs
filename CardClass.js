// Classes that builds and manages cards and players

  //This card class stores details about every card.
  class CardData{
    name;
    details;
    pictureLink;

    constructor(strName, strDetails)
    {
        this.name = strName;
        this.details = strDetails;
        // this.pictureLink = strPictureLink;
    }

    //TODO make all class getters have this _ bit for standards
    _name() {return this.name;}
    _details(){return this.details}

    setPicture(strPictureLink){
        this.pictureLink = strPictureLink;
    }

    printDetails()
    {
        console.log("card name: " + this.name);
        console.log("card details: " + this.details);
    }
  }

class PlayerData{
    name;
    playersHand = [];
    playersTableHand = []; //TODO pending what is the easiest way to manage this// This would be the cards played by a plyer (if they need to be on the table)

    constructor(strPlayerName)
    {
        this.name = strPlayerName;
    }

    getName(){
        return this.name;
    }

    getPlayersHand()
    {
        return this.playersHand;
    }

    addCardToHand(objCard)
    {
        this.playersHand.push(objCard);
    }

    playCard()
    {
        //TODO Need a way for the html page to tell this class which card in the hand to sent to playersHand[]
    }

    printPlayerCardList()
    {
        console.log("Showing card hand for player: " + this.getName())
        this.playersHand.forEach((card) => {
            card.printDetails();
        });
    }
}

 class CardManager{
    deckCardList = [];
    playerList = [];
    playerStartHandCount;
    iCurrentPlayer;

    constructor(lngPlayerStartHand)
    {
        this.playerStartHandCount = lngPlayerStartHand;
        // this.startGame(); //Need to populate cards first
    }

    addPlayer(strPlayerName){
        this.playerList.push(new PlayerData(strPlayerName))
    }

    addNewCard(strName, strDetails, count){
        //loop count times, add to a list
        var i;
        for (i = 0; i < count; i++)
        {
            // console.log("I am adding a card" + strName + ": #" + count)
            this.deckCardList.push(new CardData(strName, strDetails));
        }
    }

    getCardFromDeck(iCard){
        return this.deckCardList[iCard];
    }

    getCurrentPlayer()
    {
        return this.iCurrentPlayer;
    }

    shuffleDeck(){
        shuffleArray(this.deckCardList);
    }

    drawCard(iPlayer){
        if (iPlayer == null)
        {
            iPlayer = this.getCurrentPlayer();
        }

        if (this.deckCardList.length == 0)
        {
            throw new Error("The deck is empty, failed to draw a card");
        }

        var objCard = this.deckCardList.pop();
        this.playerList[iPlayer].addCardToHand(objCard);
        console.log("/////////Drawing card "+ objCard.name +" for player : " + iPlayer);
    }

    //This is the position of the card on top of the deck 
    //TODO not sure about this way, it seems pretty messy
    //Trying to purge thi
    // getTopOfDeck(){
    //     for(var iCard = 0; iCard < this.fullCardList.length--; iCard++)
    //     {
    //         // var objCard = this.fullCardList[iCard];
    //         // console.log("testin pullin out obj");

    //         // console.log(objCard._location());
    //         if (this.getCardFromList(iCard)._location() == CardLocation.Deck) {
    //             console.log("The top card is " + iCard + ". Printing details.");
    //             this.getCardFromList(iCard).printDetails();
    //             return iCard;
    //         }
    //     }
    // }

    startGame(){
        //intial setup
        this.iCurrentPlayer = 0;
        this.shuffleDeck(); 

        //Dealing cards to players
        this.initialDeal();
    }

    initialDeal()
    {
        var totalCardsToDeal = this.playerList.length * this.playerStartHandCount;
        console.log("Total cards to deal: " + totalCardsToDeal);

        if (totalCardsToDeal > this.deckCardList.length) throw new error("Trying to draw " + totalCardsToDeal + " from " + this.deckCardList.length + " cards.");

        for(var iPlayer = 0; iPlayer < this.playerList.length; iPlayer++)
        {
            for (var iPlayerCard = 0; iPlayerCard < this.playerStartHandCount; iPlayerCard++)
            {
                this.drawCard(iPlayer);
            }
            // this.playerList[iPlayer].printPlayerCardList();
        }
    }
 }
  

function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}