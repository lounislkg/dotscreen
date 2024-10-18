interface Case {
    element: HTMLDivElement;
    color: "x"|"o"|"";
}

interface Column {
    cases: Case[];
    top: number;
}

//HTML elements
const currentPlayerElement = document.getElementById('currentPlayer');
const errorInfos = document.getElementById('errorInfos');

const resetButton = document.getElementById('resetButton');
const playAgainButton = document.getElementById('playAgainButton');

resetButton?.addEventListener('click', resetGame);
playAgainButton?.addEventListener('click', resetGame);

//créer la grille
let colonnes : Column[] = [];
type Player = "x" | "o";
let currentPlayer : Player = "x";
let canPlay = true;

function changePlayer() {
    currentPlayer = currentPlayer === "x" ? "o" : "x";
    if (currentPlayerElement) {
        currentPlayerElement.innerHTML = currentPlayer === "x" ? 'Red' : 'Yellow';
        if (currentPlayer === "x") {
            currentPlayerElement.classList.remove('yellow');
            currentPlayerElement.classList.add('red');
        }
        else {
            currentPlayerElement.classList.remove('red');
            currentPlayerElement.classList.add('yellow');
        }
    }
}

function createGrid() {
    const main = document.querySelector('.main');
    if (currentPlayerElement)
        currentPlayerElement.innerHTML = 'Red';
    for (let i = 0; i < 7; i++) {
        const colonne = document.createElement('div');
        const cases : Case[] = [];
        colonne.classList.add('colonne');
        for (let j = 0; j < 6; j++) {
            const case_ = document.createElement('div');
            if (j === 0) {
                case_.id = `colmun-${i}`;
                case_.classList.add('top');
                case_.addEventListener('click', (e) => {
                    const target = e.target as HTMLDivElement;
                    if(target.id)
                        Play(parseInt(target.id.split('-')[1]));
                });
            }
            const case_obj : Case = {
                element: case_,
                color: ""
            };
            cases.push(case_obj);
            case_.classList.add('case');
            colonne.appendChild(case_);
        }
        colonnes.push({
            cases: cases,
            top: 5
        } as Column);
        main?.appendChild(colonne);
    }
}

function Play(colmun_id:number) {
    const colmun = colonnes[colmun_id];
    const case_ = colmun.cases[colmun.top];
    if (!canPlay) {
        if (errorInfos)
            errorInfos.innerHTML = 'Game is finished';
        return;
    }
    else {
        if (errorInfos)
            errorInfos.innerHTML = "";
    }
    if (colmun.top < 0) {
        if (errorInfos)
            errorInfos.innerHTML = 'This column is full';
        return;
    }
    else {
        if (errorInfos)
            errorInfos.innerHTML = "";
    }
    if (currentPlayer === "x") {
        case_.element.classList.add('cross');
        case_.color = "x";
    }
    else {
        case_.element.classList.add('circle');
        case_.color = "o";
    }
    colmun.top--;
    checkWin();
    changePlayer();
}

function resetGame() {
    colonnes = [];
    currentPlayer = "x";
    const main = document.querySelector('.main');
    if (main)
        main.innerHTML = "";
    canPlay = true;
    
    if (errorInfos)
        errorInfos.innerHTML = "";
    hideVictoryMessage();
    createGrid();
}

function checkWin() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 6; j++) {
            const case_ = colonnes[i].cases[j];
            if (case_.color === "") {
                continue;
            }
            //check horizontal
            if (i < 4) {
                if (case_.color === colonnes[i+1].cases[j].color &&
                    case_.color === colonnes[i+2].cases[j].color &&
                    case_.color === colonnes[i+3].cases[j].color) {
                        win();
                        return;
                    }
            }
            //check vertical
            if (j < 3) {
                if (case_.color === colonnes[i].cases[j+1].color &&
                    case_.color === colonnes[i].cases[j+2].color &&
                    case_.color === colonnes[i].cases[j+3].color) {
                        win();
                        return;
                    }
            }
            //check diagonal
            if (i < 4 && j < 3) {
                if (case_.color === colonnes[i+1].cases[j+1].color &&
                    case_.color === colonnes[i+2].cases[j+2].color &&
                    case_.color === colonnes[i+3].cases[j+3].color) {
                        win();
                        return;
                    }
            }
            if (i < 4 && j > 2) {
                if (case_.color === colonnes[i+1].cases[j-1].color &&
                    case_.color === colonnes[i+2].cases[j-2].color &&
                    case_.color === colonnes[i+3].cases[j-3].color) {
                        win();
                        return;
                    }
            }
        }
    }
}

function win() {
    console.log('player : ', currentPlayer, ' won');
    stopGame();
    showVictoryMessage(currentPlayer);
}

function showVictoryMessage(player: Player) {
    const victoryMessage = document.getElementById('victoryMessage');
    const winnerSpan = document.getElementById('winner');
    if (victoryMessage === null || winnerSpan === null) {
        return;
    }
    winnerSpan.textContent = player==='x' ? 'Red' : 'Yellow';
    victoryMessage.classList.add('show');
}

function hideVictoryMessage() {
    const victoryMessage = document.getElementById('victoryMessage');
    if (victoryMessage === null) {
        return;
    }
    victoryMessage.classList.remove('show');
}

function stopGame() {
    canPlay = false;
}

createGrid();


