//ezen szavak közül válogat a program, ezeket kell kitalálni
const targetWords = [
    "kutya",
    "bokor",
    "dajka",
    "garat",
]
//ide jönnek azok az értelmes szavak amelyeket megadhat a felhasználó a találgatáshoz
const dictionary = [
    "kutya",
    "bokor",
    "dajka",
    "garat",
    "kebab",
    "nagyi",
    "randm"
]
  const WORD_LENGTH = 5
  const FLIP_ANIMATION_DURATION = 500
  const DANCE_ANIMATION_DURATION = 500
  const keyboard = document.querySelector("[data-keyboard]")
  const alertContainer = document.querySelector("[data-alert-container]")
  const guessGrid = document.querySelector("[data-guess-grid]")
  //random szó kiválasztása a tömbből
  const randomIndex = Math.floor(Math.random() * targetWords.length);
  const targetWord = targetWords[randomIndex];
  
  startInteraction()

  //elkezdi figyelni
  function startInteraction() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
  }

  //leállítja a figyelés
  function stopInteraction() {
    document.removeEventListener("click", handleMouseClick)
    document.removeEventListener("keydown", handleKeyPress)
  }
  
  //kattintás figyelő és elosztó úgymond
  function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key)
      return
    }
  
    if (e.target.matches("[data-enter]")) {
      submitGuess()
      return
    }
  
    if (e.target.matches("[data-delete]")) {
      deleteKey()
      return
    }
  }

  //billentyű figyelő és szortírozó
  function handleKeyPress(e) {
    if (e.key === "Enter") {
        submitGuess();
        return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey();
        return;
    }


    if (e.key.match(/^[a-záéíóöőúüű]$/i)) {
        pressKey(e.key);
        return;
    }
}

  //ha van szabad hely beirja a leütött karaktert  
  function pressKey(key) {
    const activeTiles = getActiveTiles()
    if (activeTiles.length >= WORD_LENGTH) return
    const nextTile = guessGrid.querySelector(":not([data-letter])")
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key
    nextTile.dataset.state = "active"
  }
  
  //törlőgomb
  function deleteKey() {
    const activeTiles = getActiveTiles();
    const lastTile = activeTiles[activeTiles.length - 1];
    if (lastTile == null) return;
    lastTile.textContent = "";
    lastTile.removeAttribute("data-state");
    lastTile.removeAttribute("data-letter");
  }
  
  //ellenőrzi, hogy elég szó van e, ha igen akkor ellenőrzi hogy az adott szó benne van e a szótárban.
  function submitGuess() {
    const activeTiles = [...getActiveTiles()]
    if (activeTiles.length !== WORD_LENGTH) {
      showAlert("Kevés betűt adott meg!")
      shakeTiles(activeTiles)
      return
    }
  
    const guess = activeTiles.reduce((word, tile) => {
      return word + tile.dataset.letter
    }, "")
  
    if (!dictionary.includes(guess)) {
      showAlert("Nincs ilyen szó az adatbázisban!")
      shakeTiles(activeTiles)
      return
    }
  
    stopInteraction()
    activeTiles.forEach((...params) => flipTile(...params, guess))
  }
  
  function flipTile(tile, index, array, guess) {
    //lekérjük az adott box betűjét
    const letter = tile.dataset.letter
    //megkeresi a billentyűzeten is a betűt
    const key = keyboard.querySelector(`[data-key="${letter}"i]`)
    //fordulás
    setTimeout(() => {
      tile.classList.add("flip")
    }, (index * FLIP_ANIMATION_DURATION) / 2)
  
    tile.addEventListener(
      "transitionend",
      () => {
        //eltávolítjuk a flippet
        tile.classList.remove("flip")
        if (targetWord[index] === letter) {
            //jó helyen van
          tile.dataset.state = "correct"
          key.classList.add("correct")
        } else if (targetWord.includes(letter)) {
            //rossz helyen van
          tile.dataset.state = "wrong-location"
          key.classList.add("wrong-location")
        } else {
            //nincs benne
          tile.dataset.state = "wrong"
          key.classList.add("wrong")
        }
         //utcsó
        if (index === array.length - 1) {
          tile.addEventListener(
            "transitionend",
            () => {
                //ujra interakt
              startInteraction()
              //megnézzük hogy nyert-e
              checkWinLose(guess, array)
            },
            { once: true }
          )
        }
      },
      { once: true }
    )
  }
  
  //aktív boxokat adja vissza
  function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
  }

  //allert generáló
  function showAlert(message, duration = 1000) {
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    alertContainer.prepend(alert)
    if (duration == null) return
  //időzített eltűnés
    setTimeout(() => {
      alert.classList.add("hide")
      alert.addEventListener("transitionend", () => {
        alert.remove()
      })
    }, duration)
  }
  //megrázza a kockákat, rárakja a classlistet
  function shakeTiles(tiles) {
    tiles.forEach(tile => {
      tile.classList.add("shake")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("shake")
        },
        { once: true }
      )
    })
  }
  //W allert
  function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
      showAlert("Nyertél, gratulálok!", 5000)
      danceTiles(tiles)
      stopInteraction()
      return
    }
  //ha nem sikerül kitalálni megmutatja a keresett szót és leállítja az interaktálást
    const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
      showAlert(targetWord.toUpperCase(), null)
      stopInteraction()
    }
  }
  //boxok "tánc" animációjának hozzáadása
  function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("dance")
        tile.addEventListener(
          "animationend",
          () => {
            tile.classList.remove("dance")
          },
          { once: true }
        )
      }, (index * DANCE_ANIMATION_DURATION) / 5)
    })
  } 

  
//felugró ablakhoz szükséges definiálások
const showPopup = document.querySelector('.show-popup');
const popupContainer = document.querySelector('.popup-container');
const closeBtn = document.querySelector('.close-btn');
//ha helpre kattint jelenle meg, ha bezárja tünjön el
showPopup.onclick = () => {
  popupContainer.classList.add('active');
}

closeBtn.onclick = () => {
  popupContainer.classList.remove('active');
}
