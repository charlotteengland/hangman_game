import Home from "./home.js";
import { sound } from "./../data/sound.js";
import End from "./end.js";
import Board from "./board.js"

const Game = (_ => {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  const words = ["apple", "dog", "ball", "bike"];
  let chosenWord;
  let guessingWord;
  let lives;
  let guesses;

  //cache the dom
  const $hangman = document.querySelector(".hangman");

  const init = _ => {
    // make computer choose a random word - chosenword = chooseword() //
    chosenWord = chooseWord();
    guessingWord = Array(chosenWord.length).fill("_");
    guesses = [];
    lives = 7;
    //show initital screen
    showInitPage();
    // active listeners to be listening
    listeners();
    Board.init();

  }

  const listeners = _ => {
    $hangman.addEventListener('click', event => {
      if (event.target.matches('.hangman__letter')) {
        sound.click.play();
        check(event.target.innerHTML)
      }
      if (event.target.matches('.hangman__trigger')){
          Home.init()
          sound.click.play()
      }
    })
  }

  // returns true if user already has guess this letter
  const isAlreadyTaken = letter => {
  return guesses.includes(letter);
  }

  // -- MAIN LOGIC --
  const check = guess => {
    if (isAlreadyTaken(guess)) return;
    guesses.push(guess);

    // check if the guesses letter exists in chosen word
    if (chosenWord.includes(guess)) {

      //update guessingword and reveal letter position 
      updateGuessingWord(guess);
      console.log(guessingWord);
    } else {
      lives --;
      // render the board accordingly
      Board.setLives(lives);
    }
    render();

    // check if game is over
    isGameOver();
  }


  const updateGuessingWord = letter => {
    chosenWord.split("").forEach((elem, index) => {
      if (elem === letter) {
        // if true update guessing word with index to elem
        guessingWord[index] = elem;
      }
    })
  }
  

  const render = _ => {
    document.querySelector(".hangman__lives").innerHTML = lives;
    document.querySelector(".hangman__word").innerHTML = guessingWord.join("");
    document.querySelector(".hangman__letters").innerHTML = createLetters()
  };
 

  const showInitPage = _ => {
    let markup = `
    <p class="hangman__states">Lives:
    <span class="hangman__lives">${lives}</span>
    </p>
    <h1 class="hangman__title">Hangman</h1>
    <canvas class="hangman__board" height="155px"></canvas>
    <div class="hangman__word">${guessingWord.join("")}</div>
    <p class="hangman__instructions">Pick a Letter below to guess a word</p>
    <ul class="hangman__letters">
    ${createLetters()}
    </ul>
    <button class="button hangman__trigger">Main Menu</button>
    `
    $hangman.innerHTML = markup;
  }
  const createLetters = _ => {
    let markup = ``;
    letters.forEach((letter) => {
      const isActive = isAlreadyTaken(letter) ? 'hangman__letter--active' : '';
      markup += `
      <li class="hangman__letter" ${isActive}>${letter}</li>
      `
    })
    return markup;
  }

  const hasWon = _ => guessingWord.join("") === chosenWord;

  const hasLost = _ => lives <= 0;

  const isGameOver = _ => {
    // if won, then alert("win")
    if (hasWon()) {
      sound.win.play();
      End.setState({
        chosenWord: chosenWord,
        result: "win"
      })
    }
    if (hasLost()) {
      sound.lose.play();
      End.setState({
        chosenWord: chosenWord,
        result: "lose"
      })
    }
  }
    // if lost, then alrert("lose")
  

  //computer chooses a random word from the words array
  const chooseWord = _ => {
    let randNum = Math.floor(Math.random() * words.length);
    return words[randNum];
  }


  return {
    init
  }
})();

export default Game;