// Classes that builds and manages cards and players

  //This card class stores details about every card.
  class CardData{
    name;
    details;
    pictureLink;

    //Card Effect Properties
    totalStealCards = 0;
    totalDrawCards = 0;
    totalGiftCards = 0;
    totalProtectTurns = 0;
    isPlayDisabled = false;
    isSelectable = false;

    constructor(strName, strDetails)
    {
        this.name = strName;
        this.details = strDetails;
        // this.pictureLink = strPictureLink;
    }

    //TODO make all class getters have this _ bit for standards
    _name() {return this.name;}
    _details(){return this.details;}
    _totalStealCards(){return this.totalStealCards;}
    _totalDrawCards(){return this.totalDrawCards;}
    _totalGiftCards(){return this.totalGiftCards;}
    _totalProtectTurns(){return this.totalProtectTurns;}
    _isPlayDisabled(){return this.isPlayDisabled};
    _isSelectable(){return this.isSelectable;}

    setPicture(strPictureLink){
        this.pictureLink = strPictureLink;
    }

    //Card action types
    SetStealCards(nTotalStealCards){
        this.totalStealCards = nTotalStealCards;
        if (nTotalStealCards !== 0) this.isSelectable = true;
    }

    SetDrawCards(nTotalDrawCards){
        this.totalDrawCards = nTotalDrawCards;
        if (nTotalDrawCards !== 0) this.isSelectable = true;
    }

    SetGiftCards(nTotalGiftCards)
    {
        this.totalGiftCards = nTotalGiftCards;
        if (nTotalGiftCards !== 0) this.isSelectable = true;
    }

    SetProtectTurns(nTotalTurns){
        this.totalProtectTurns = nTotalTurns;
        if (nTotalTurns !== 0) this.isSelectable = true;
    }

    DisableCardPlay()
    {
        this.isPlayDisabled = true;
        //This should set this.isSelectable = false, but this might have conflicts with other card properties. 
    }

    //Debugging support
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

    iGetCard(iCard){
        if (iCard < 1) return;
        if (this.playersHand.length < iCard) throw new Error("Cannot get [" + iCard + "] from the players hand: " + this.playersHand.length);

        return this.playersHand[iCard];
    }

    printPlayerCardList()
    {
        console.log("Showing card hand for player: " + this.getName())
        this.playersHand.forEach((card) => {
            card.printDetails();
        });
    }

    playiCard(iCard){
        //Sending card to the players table hand
        let objCardData = this.playersHand.splice(iCard, 1)[0];
        this.playersTableHand.push(objCardData);
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
    
    //Player Management
    getCurrentPlayerIndex(){return this.iCurrentPlayer;}

    getCurrentPlayerObj()
    {
        return this.playerList[this.getCurrentPlayerIndex()];
    }
    
    getTotalPlayers(){
        return this.playerList.length;
    }

    getPlayerNameByIndex(iFindPlayer)
    {
        for (let iPlayer = 0; iPlayer < this.playerList.length; iPlayer++) {
            if (iPlayer === iFindPlayer){
                return this.playerList[iPlayer].name;
            }
        }
        throw new Error("Failed to find player [" + iFindPlayer + "] in the player list. List size: " + this.playerList.length);
    }
    
    addPlayer(strPlayerName){
        if (strPlayerName == "") throw new Error("Adding a new player name cannot be empty");
        if(this.findPlayerByName(strPlayerName, true) !== -1) throw new Error("Name is already taken");

        this.playerList.push(new PlayerData(strPlayerName))
    }

    nextPlayer(){
        this.iCurrentPlayer++;
        if (this.iCurrentPlayer >= this.getTotalPlayers())
        {
            this.iCurrentPlayer = 0;
        }
    }

    findPlayerByName(strName, blnAllowMissing = false)
    {
        for (let iPlayer = 0; iPlayer < this.playerList.length; iPlayer++) {
            if (this.playerList[iPlayer].name === strName){
                return iPlayer;
            }
        }
        
        if (blnAllowMissing) return -1;
        throw new Error("Failed to find player [" + strName + "] in the player list");
    }
    
    //Card Management
    addNewCard(strName, 
        strDetails, 
        count, 
        totalStealCards = 0, 
        totalDrawCards = 0,
        totalGiftCards = 0,
        totalProtectTurns = 0,
        isDisabledPlay = false)
    {
        for (let i = 0; i < count; i++)
        {
            let objCardData = new CardData(strName, strDetails);
            objCardData.SetDrawCards(totalDrawCards);
            objCardData.SetStealCards(totalStealCards);
            objCardData.SetGiftCards(totalGiftCards);
            objCardData.SetProtectTurns(totalProtectTurns);
            if(isDisabledPlay) objCardData.DisableCardPlay();
            
            this.deckCardList.push(objCardData);
        }
    }

    shuffleDeck(){
        shuffleArray(this.deckCardList);
    }
    
    getCardFromDeck(iCard){
        return this.deckCardList[iCard];
    }

    drawCard(iPlayer){
        if (iPlayer == null)
        {
            iPlayer = this.getCurrentPlayerIndex();
        }

        if (this.deckCardList.length == 0)
        {
            throw new Error("The deck is empty, failed to draw a card");
        }

        var objCard = this.deckCardList.pop();
        this.playerList[iPlayer].addCardToHand(objCard);
        console.log("/////////Drawing card "+ objCard.name +" for player : " + iPlayer);
    }

    moveCard(iPlayerThief, iPlayerVictim){
        //Getting a random card from victim
        if (this.playerList[iPlayerVictim].playersHand.length === 0) {
            throw new Error("Cannot steal from target player [" + iPlayerVictim + "] who doesnt have any more cards" );
        }
        const j = randomInt(this.playerList[iPlayerVictim].playersHand.length);
        var objStolenCard =  this.playerList[iPlayerVictim].playersHand.splice(j, 1)[0];
        this.playerList[iPlayerThief].addCardToHand(objStolenCard);
    }

    //Game Manager
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

        if (totalCardsToDeal > this.deckCardList.length) throw new Error("Trying to draw " + totalCardsToDeal + " from " + this.deckCardList.length + " cards.");

        for(var iPlayer = 0; iPlayer < this.playerList.length; iPlayer++)
        {
            for (var iPlayerCard = 0; iPlayerCard < this.playerStartHandCount; iPlayerCard++)
            {
                this.drawCard(iPlayer);
            }
        }
    }
 }
  

