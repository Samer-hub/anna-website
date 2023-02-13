"use strict";

/**
 * Globalt objekt som innehåller de attribut som ni skall använda.
 * Initieras genom anrop till funktionern initGlobalObject().
 */
let oGameData = {};


/**
 * Initerar det globala objektet med de attribut som ni skall använda er av.
 * Funktionen tar inte emot några värden.
 * Funktionen returnerar inte något värde.
 */
function initGlobalObject() {


    //Kan anta värdet 1 eller 2 och indikerar vilken spelare som ska vända på kort.
    oGameData.currentPlayer = "";

    //Nickname för spelare ett som tilldelas från ett formulärelement,
    oGameData.nickNamePlayerOne = "";

    //Nickname för spelare två som tilldelas från ett formulärelement.
    oGameData.nickNamePlayerTwo = "";

    //Färg för spelare ett som tilldelas från ett formulärelement.
    oGameData.colorPlayerOne = "";

    //Färg för spelare två som tilldelas från ett formulärelement.
    oGameData.colorPlayerTwo = "";

    //Poäng för spelare ett, räknas upp vid varje par
    oGameData.scorePlayerOne = 0;

    //Poäng för spelare två, räknas upp vid varje par
    oGameData.scorePlayerTwo = 0;

    //Varje spelares tur innehåller två drag, currentMove ska ändras till 2 när första kortet vänts
    //och sedan tillbaka till 1 när det är nästa spelares tur att vända första kortet
    oGameData.currentMove = 1;

    //Ska användas för att spara referensen till den första uppvända img-taggen (kortet) i varje drag
    oGameData.flippedCard = "";
    

    //Innehåller återstående antal ej ihopparade kort på spelplanen
    oGameData.remainingCards = 16;

    //Sätts till true vid timerfunktion för att förhindra att nya kort vänds innan timer exekverats
    oGameData.gameLocked = false;

}

/**
 * Funktion som skapar upp spelplan.
 * Funktionen tar referens till elementet den skall läggas in i.
 * Funktionen returnerar inte något värde.
 */
function generateGameField(nodeRef) {

    //Töm spelplan
    nodeRef.innerHTML = '';

    //Göm formulär
    document.querySelector('form').classList.add('d-none');

    //Tömm felmeddelande
    document.querySelector('#errorMsg').textContent = '';
    nodeRef.classList.add('row', 'justify-content-center', 'mt-5');

    //Generera spelplan
    let table = document.createElement('table');
    table.classList.add('ml-0', 'mr-0');

    //Generera "kortlek" med 16 kort, 2 st av varje kort nr 1-8
    let carddeck = [];
    for (let i = 1; i < 9; i++) {
        for (let j = 0; j < 2; j++) {
            carddeck.push({ "value": i, "imageurl": 'images/' + i + '.jpg' });
        }
    }

    //Blanda kortlek
    carddeck = shuffle(carddeck);

    for (let i = 0; i < 4; i++) {
        let row = document.createElement('tr');

        for (let j = 0; j < 4; j++) {

            let col = document.createElement('td');
            let img = document.createElement('img');
            let card = carddeck.pop();
            col.style = "width: 90px; height:160px; border: solid 1px darkgray; font-size: 50px; text-align: center;";
            //col.textContent = "O";
            col.style.backgroundColor = '#CCCCCC';
            img.src = card.imageurl;
            img.setAttribute('data-kortid', card.value);
            img.setAttribute('data-card-inplay', 'true');
            img.classList.add('w-100', 'd-none');
            col.appendChild(img);
            row.appendChild(col);
        }
        table.appendChild(row);
    }
    nodeRef.appendChild(table);

}

/**
 * Funktion som skapar upp spelplan.
 * Funktionen tar inte emot några värden.
 * Funktionen returnerar:
 * 0 - ingen vinnare.
 * 1 - spelare ett har vunnit.
 * 2 - spelare två har vunnit
 * 3 - oavgjort
 */
function checkForWinner() {

    if (oGameData.remainingCards === 0) {

        if (oGameData.scorePlayerOne > oGameData.scorePlayerTwo) {
            return 1;
        }
        else if (oGameData.scorePlayerOne < oGameData.scorePlayerTwo) {
            return 2;
        }
        else {
            return 3;
        }
    }
    else {
        return 0;
    }
}


function removeListenerFromTable() { 
    document.querySelector("table").removeEventListener("click", executeMove);
}
function addListenerToTable() {
    document.querySelector("table").addEventListener("click", executeMove);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }

    return a;
}