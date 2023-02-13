/**
 * Förnamn:
 * Efternamn:
 * Initialer:
 * Personummer:
 * Datum:
 * Kurskod:
 * Kursnamn:
 */

"use strict";

function validateForm() {

    try {

        let playerOne = document.querySelector("#nick_1");
        let playerTwo = document.querySelector("#nick_2");
        let colorPlayerOne = document.querySelector("#color_1");
        let colorPlayerTwo = document.querySelector("#color_2");
        let divRef = document.querySelector("#errorMsg");

		console.log("colorPlayerOne:" + colorPlayerOne.value);
		console.log("colorPlayerTwo:" + colorPlayerTwo.value);

        
        if(playerOne.value.length < 3) {
            throw { "nodeRef" : playerOne };
        }   
            
        if(playerTwo.value.length < 3) {
            throw { "nodeRef" : playerTwo };
        }

        if( playerOne.value === playerTwo.value) {
            throw { "nodeRef" : playerTwo };
        }

        if( colorPlayerOne.value === "#ffffff") {
            throw { "nodeRef" : colorPlayerOne };
        }

        if( colorPlayerTwo.value === "#ffffff") {
            throw { "nodeRef" : colorPlayerTwo };
        }

        if( colorPlayerOne.value === colorPlayerTwo.value ){
            throw { "nodeRef" : colorPlayerTwo };
        }

        initGlobalObject();

        oGameData.nickNamePlayerOne = playerOne.value;
        oGameData.nickNamePlayerTwo = playerTwo.value;
        oGameData.colorPlayerOne = colorPlayerOne.value;
        oGameData.colorPlayerTwo = colorPlayerTwo.value;
        

        divRef.textContent = "";
        
        return true;

    } catch ( e ) {
        let errorMsg = "Ange " + e.nodeRef.getAttribute("title") + "!";
        
        document.querySelector("#errorMsg").textContent = errorMsg;
        e.nodeRef.focus();
        return false;
    }

}

function initiateGame() {

    let gameDiv = document.querySelector('#gameArea');
        
    //Ropa på funktion för att skapa upp spelplan
    generateGameField(gameDiv);

    //Lägg till lyssnare
    addListenerToTable();

    let rndValue = Math.random();
    let spanRef = document.querySelector("main div h1");
    let playerChar = "";
    let playerName = "";

    if(rndValue < 0.5) {
        oGameData.currentPlayer = 1;
        oGameData.currentMove = 1;
        playerChar = oGameData.playerOne;
        playerName = oGameData.nickNamePlayerOne;
    } else {
        oGameData.currentPlayer = 2;
        oGameData.currentMove = 1;
        playerChar = oGameData.playerTwo;
        playerName = oGameData.nickNamePlayerTwo;
    }

    spanRef.textContent = "Aktuell spelare är " + playerName;
}

function executeMove( e ) {
 
    //console.log(e.target.tagName);
    if(e.target.tagName === "TD") {
        
        if (e.target.firstChild.getAttribute('data-card-inplay') === "true" && oGameData.gameLocked===false) {

                e.target.firstChild.classList.toggle('d-none');

                //Om första draget sätt flipped card och räkna upp drag och vänd tillbaka förra spelarens kort
                if (oGameData.currentMove === 1) {
                    
                    oGameData.flippedCard = e.target.firstChild;
                    oGameData.currentMove=2;
                }
                else {
                    // Drag 2, Kontrollera om korten är lika
                    if (e.target.firstChild.getAttribute('data-kortid') === oGameData.flippedCard.getAttribute('data-kortid')) {
                        
                        // Räkna upp score med 1
                        if(oGameData.currentPlayer===1) {
                            oGameData.scorePlayerOne++;
                        }
                        else {
                            oGameData.scorePlayerTwo++;
                        }

                        //Sätt kort som ur spel
                        e.target.firstChild.setAttribute('data-card-inplay','false');
                        oGameData.flippedCard.setAttribute('data-card-inplay', 'false');

                        //Sätt spelarens färg som kantlinje                       
                        if(oGameData.currentPlayer === 1){
                            e.target.firstChild.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerOne + ';');
                            oGameData.flippedCard.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerOne + ';');
                        }
                        else {
                            e.target.firstChild.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerTwo + ';');
                            oGameData.flippedCard.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerTwo + ';');
                        }

                        //Minska antalet kvarvarnde kort
                        oGameData.remainingCards = oGameData.remainingCards -2;

                        //Sätt currentMove till 1
                        oGameData.currentMove = 1;
                        
                    }
                    else {
						// VG-DEL
                        //Vänd tillbaka kort och byt spelare efter 1,5s 
                        oGameData.gameLocked = true; //Lås spelet för klick tills timer exekveras
                        setTimeout(function () { 
                            e.target.firstChild.classList.toggle('d-none');
                            oGameData.flippedCard.classList.toggle('d-none');

                            //Byt spelare
                            if (oGameData.currentPlayer === 1) {
                                oGameData.currentPlayer = 2;
                                //Skriv ut vems tur
                                document.querySelector("main div h1").textContent = "Aktuell spelare är " + oGameData.nickNamePlayerTwo;
                            }
                            else {
                                oGameData.currentPlayer = 1;
                                //Skriv ut vems tur
                                document.querySelector("main div h1").textContent = "Aktuell spelare är " + oGameData.nickNamePlayerOne;
                            }
                            oGameData.currentMove = 1;

                            oGameData.gameLocked = false;

                        }, 1500); 
						// SLUT VG-DEL

                    }                                 

                    //Kontrollera om spel slut
                    let winner = checkForWinner();
                    if(winner!==0) {
                        
                        document.querySelector('form').classList.remove('d-none');
                        removeListenerFromTable();

                        //Kolla vinnare
                        let winnermsg;
                        if(winner===1) {
                            winnermsg = oGameData.nickNamePlayerOne
                        }
                        else if(winner===2) {
                            winnermsg = oGameData.nickNamePlayerTwo
                        }
                        else {
                            winnermsg = "Ingen"
                        }

                        document.querySelector("main div h1").textContent = winnermsg + ' har vunnit!';

                    }

                }              
        }
    }
}

//Lyssnare för när DOM:en är byggd!
window.addEventListener("load", function() {
    
    
    //Lyssnare för när användaren klickar på elementet med id=btnPlayGame (button)!
    document.querySelector("#newGame").addEventListener("click", function() {
        if( validateForm() ) {
            initiateGame();
        }   
    });
   
});





