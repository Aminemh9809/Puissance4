


// Nombre de lignes et de colonnes
var rows = 0;
var cols = 0;
// cet tableau à deux dimensions contient l'état du jeu:
//0: case vide
//1: pion du joueur 1
//2: pion du joueur 2
var board = [];
// timer depart de la partie
var departTimerPartie = 0;
// timer depart du jeu
var departTimerJeu = 0;
// l'interval de la partie
var timerPartie;
// l'interval du jeu 
var timerJeu;
// initiliser le temps joué global
var temps_jeu = "00:00";
// initiliser le temps joué d'une partie
var temps_partie = "00:00";
// tableau des parties , joueur gagné , temps {  gagant, temps}
var parties = [];
// un entier: 1 ou 2 (le numéro du prochain joueur)
var turn = 1;
// Nombre de coups joués
var moves = 0;
/* un entier indiquant le gagnant:
  null: la partie continue
  0: la partie est nulle
  1: joueur 1 a gagné
2: joueur 2 a gagné
*/
scorePlayer1 = 0;
scorePlayer2 = 0;
var winner = null;
// On initialise le plateau et on visualise dans le DOM
// (dans la balise d'identifiant `game`).

// L'élément du DOM où se fait l'affichage
var element = document.getElementById("game");


/*
  Intialise un plateau de jeu de dimensions `rows` × `cols` (par défaut 6×7),
  et fait l'affichage dans l'élément `.
*/

function nouveau() {
  current_player(0);
  element.innerHTML = "";
  document.getElementById("score").style.display = 'none';
  document.getElementById("timer").style.display = 'none';
  document.getElementById("buttons").style.display = 'none';
  document.getElementById("buttonvalider").style.display = '';
  document.getElementById("row").disabled = false;
  document.getElementById("col").disabled = false;
  rows = 0;
  cols = 0;
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  document.getElementById("ScorePlayer1").innerHTML = scorePlayer1;
  document.getElementById("ScorePlayer2").innerHTML = scorePlayer2;
  departTimerPartie = 0;
  // arreter timer de la partie
  clearInterval(timerPartie);
  departTimerJeu = 0;
  // arreter timer du jeu
  clearInterval(timerJeu);
}
// Cette fonction vide le plateau et remet à zéro l'état

function reset() {
  initialiserBord();
  affiche_plateau();
  moves = 0;
  winner = null;
  // arreter timer de la partie
  clearInterval(timerPartie);
  departTimerPartie = 0;
  timerPartieF();
}
function lancerJeu() {
  rows = document.getElementById("row").value;
  cols = document.getElementById("col").value;
  if (parseInt(rows) < 4 && parseInt(cols) < 4) {
    alert('Il faut minimum 4 lignes ou 4 colonnes');
    return;
  }
  document.getElementById("score").style.display = '';
  document.getElementById("timer").style.display = '';
  document.getElementById("buttons").style.display = '';
  document.getElementById("buttonvalider").style.display = 'none';
  document.getElementById("row").disabled = true;
  document.getElementById("col").disabled = true;

  initialiserBord();
  affiche_plateau();
  timerPartieF();
  timerJeuF();
}

function initialiserBord() {
  board = new Array(rows);
  for (let i = 0; i < rows; i++) {
    board[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      board[i][j] = '0';
    }
  }
}



/***

  fonctions
  
 **/
/* Affiche le plateau de jeu dans le DOM */
function affiche_plateau() {
  let table = document.createElement('table');
  // Les indices pour le jeu vont de bas en haut (compteur i de la boucle)
  for (let i = rows - 1; i >= 0; i--) {
    let tr = table.appendChild(document.createElement('tr'));
    for (let j = 0; j < cols; j++) {
      let td = tr.appendChild(document.createElement('td'));
      let colour = board[i][j];
      if (colour)
        td.className = 'player' + colour;
      td.dataset.column = j;
    }
  }
  element.innerHTML = '';
  element.appendChild(table);
  current_player(turn);
  setTimeout(verifierGaner, 500);
}
/* afficher current player*/

function current_player(joeur) {

  document.getElementById("currentImg").className = "current-player" + joeur;

}
/* ajouter  la case  player au tableau Board*/
function set(row, column, player) {
  // On colore la case
  board[row][column] = player;
  // On compte 
  moves++;
}

/* Cette fonction ajoute un pion dans une colonne */
function play(column) {
  // Trouver la première case libre dans la colonne
  let row;
  for (let i = 0; i < rows; i++) {
    if (board[i][column] == 0) {
      row = i;
      break;
    }
  }
  if (row === undefined) {
    return null;
  } else {
    // Effectuer le coup
    set(row, column, turn);
    // Renvoyer la ligne où on a joué
    return row;
  }
}
// Vérifier si la partie est encore en cours
function partie_finie() {
  if (winner !== null) {
    if (window.confirm("Game over!\n\n Voulez vous jouer une nouvelle partie ?")) {
      reset();
    } else {
      timeFinal = document.getElementById("timer").innerHTML;
      //afficher résultat final
      document.location.href = "./resultat.html?score1=" + scorePlayer1 + "&score2=" + scorePlayer2 + "&time=" + temps_jeu + "&parties=" + parties.join();
      return;
    }
    return;
  }
}

function board_click(event) {
  // retourne le numero data-column colonne selectionnée 
  let column = event.target.dataset.column;
  if (column !== undefined) {
    // les variables dans les datasets sont TOUJOURS,il vaut mieux les convertir en entier avec parseInt
    column = parseInt(column);
    let row = play(parseInt(column));
    if (row === null) {
      alert("Column is full!  ");
    } else {
      // Vérifier s'il y a un gagnant, ou si la partie est finie
      if (win(row, column, turn)) {
        winner = turn;
      } else if (moves >= rows * cols) {
        winner = 0;
      }
      // Passer le tour : 3 - 2 = 1, 3 - 1 = 2
      turn = 3 - turn;
      // Mettre à jour l'affichage
      affiche_plateau();
    }
  }
}
/** mettre à jour le tableau des parties */
function upadtePartie() {
  let partie = [winner, temps_partie];
  parties.push(partie);
}

function verifierGaner() {
  //Au cours de l'affichage,  afficher un message si la partie est finie.

  if (winner == 0) {
    alert("Aucune ligne possible, match nul !!, temps de la partie = " + temps_partie);
    scorePlayer1++;
    document.getElementById("ScorePlayer1").innerHTML = scorePlayer1;
    scorePlayer2++;
    document.getElementById("ScorePlayer2").innerHTML = scorePlayer2;
    upadtePartie();
    clearInterval(timerPartie);
    setTimeout(partie_finie, 500);
  }
  else
    if (winner == 1) {
      scorePlayer1++;
      document.getElementById("ScorePlayer1").innerHTML = scorePlayer1;
      upadtePartie();
      alert("Player 1 a gagné, temps de la partie = " + temps_partie);
      clearInterval(timerPartie);
      setTimeout(partie_finie, 500);
    }
    else
      if (winner == 2) {
        scorePlayer2++;
        document.getElementById("ScorePlayer2").innerHTML = scorePlayer2;
        upadtePartie();
        alert("Player 2 a gagné, temps de la partie = " + temps_partie);
        clearInterval(timerPartie);
        setTimeout(partie_finie, 500);
      }

  //setTimeout(partie_finie, 1000);
}
/* 
 Cette fonction vérifie si le coup dans la case `row`, `column` par
 le joueur `player` est un coup gagnant.
 
 Renvoie :
true  : si la partie est gagnée par le joueur `player`
false : si la partie continue
*/
function win(row, column, player) {
  // Horizontal
  let count = 0;
  for (let j = 0; j < cols; j++) {
    count = (board[row][j] == player) ? count + 1 : 0;
    if (count >= 4) return true;
  }
  // Vertical
  count = 0;
  for (let i = 0; i < rows; i++) {
    count = (board[i][column] == player) ? count + 1 : 0;
    if (count >= 4) return true;
  }
  // Diagonal
  count = 0;
  //console.log("Diagonal // row: " + row + " column: " + column);
  let xd = row;  // initiliser x,y
  let yd = column;
  while (xd > 0 && yd > 0) {
    // aller jusqu'a ligne0 ou colonne 0
    xd -= 1;
    yd -= 1;
  }
  while (xd < rows && yd < cols) {
    count = (board[xd][yd] == player) ? count + 1 : 0;
    xd = xd + 1;
    yd = yd + 1;
    //console.log("x: " + xd + " y: " + yd);
    if (count >= 4) return true;
  }

  // Anti-diagonal
  //console.log("Anti-diagonal // row: " + row + " column: " + column);
  count = 0;
  let x = row; // initiliser x,y
  let y = column;

  while (x > 0 && y < (cols - 1)) { // aller jusqu'a une case sur la premiere ligne ou derniere colonne
    x -= 1;
    y += 1;
  }
  while (x <= (rows - 1) && y >= 0) {// #parcours juqu'à derniere ligne ou derniere colonne 
    count = (board[x][y] == player) ? count + 1 : 0;
    x = x + 1;
    y = y - 1;
    //console.log("x: " + x + " y: " + y);
    if (count >= 4) return true;
  }


  return false;
}
function timerPartieF() {
  let temps = departTimerPartie * 60;

  timerElement = document.getElementById("timer");
  //Display "time" every second (1000 milliseconds)
  timerPartie = setInterval(() => {
    let minutes = parseInt(temps / 60, 10);
    let secondes = parseInt(temps % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    secondes = secondes < 10 ? "0" + secondes : secondes;
    temps_partie = `${minutes}:${secondes}`;
    timerElement.innerText = temps_partie;
    temps = temps + 1;
  }, 1000);
}
function timerJeuF() {
  let temps = departTimerJeu * 60;

  timerJeu = setInterval(() => {
    let minutes = parseInt(temps / 60, 10);
    let secondes = parseInt(temps % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    secondes = secondes < 10 ? "0" + secondes : secondes;
    temps_jeu = `${minutes}:${secondes}`;
    temps = temps + 1;
  }, 1000);
}