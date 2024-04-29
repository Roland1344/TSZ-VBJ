const targetWords = [
    "kékes",
    "rétes",
    "kutya",
    "három",
    "nyolc",
    "agrár",
    "melák",
    "adhat",
    "ajkai",
    "ejnye",
    "akkor",
    "aljas",
    "alibi",
    "arcok",
    "barát",
    "bokor",
    "cipős",
    "cupák",
    "csóró",
    "csősz",
    "dajka",
    "dolog",
    "dzsem",
    "edény",
    "ernyő",
    "éjfél",
    "éjjel",
    "fabak",
    "fluor",
    "garat",
    "gúnár",
    "gyanu",
    "győző",
    "harag",
    "héber",
    "idény",
    "itató",
    "íjász",
    "írnok",
    "japán",
    "jármű",
    "kanál",
    "kadét",
    "kamat",
    "latin",
    "lagzi",
    "magas",
    "műsor",
    "nőnap",
    "nagyi",
    "ostor",
    "origó",
    "óvónő",
    "ócska",
    "öngól",
    "ördög",
    "ősnép",
    "ősapa",
    "pacal",
    "pengő",
    "rabbi",
    "rómeó",
    "sarok",
<<<<<<< HEAD
=======
    "siker",
>>>>>>> 891eaa8db48a85c202528e5fe19182b501dc4a6c
    "szent",
    "szumó",
    "tabló",
    "teknő",
    "udvar",
    "unoka",
    "úrbér",
    "útzár",
    "üdítő",
    "ügyes",
    "vadőr",
    "vekni",
    "vájog",
    "webes",
    "xenon",
    "zárda",
    "zebra",
    "zsalu",
    "zsidó",
    "ytong",
]
const dictionary = [
    "kékes",
    "rétes",
    "kutya",
    "három",
    "nyolc",
    "agrár",
    "melák",
    "adhat",
    "ajkai",
    "ejnye",
    "akkor",
    "aljas",
    "alibi",
    "arcok",
    "barát",
    "bokor",
    "cipős",
    "cupák",
    "csóró",
    "csősz",
    "dajka",
    "dolog",
    "dzsem",
    "edény",
    "ernyő",
    "éjfél",
    "éjjel",
    "fabak",
    "fluor",
    "garat",
    "gúnár",
    "gyanu",
    "győző",
    "harag",
    "héber",
    "idény",
    "itató",
    "íjász",
    "írnok",
    "japán",
    "jármű",
    "kanál",
    "kadét",
    "kamat",
    "latin",
    "lagzi",
    "magas",
    "műsor",
    "nőnap",
    "nagyi",
    "ostor",
    "origó",
    "óvónő",
    "ócska",
    "öngól",
    "ördög",
    "ősnép",
    "ősapa",
    "pacal",
    "pengő",
    "rabbi",
    "rómeó",
    "sarok",
    "siker",
    "szent",
    "szumó",
    "tabló",
    "teknő",
    "udvar",
    "unoka",
    "úrbér",
    "útzár",
    "üdítő",
    "ügyes",
    "vadőr",
    "vekni",
    "vájog",
    "webes",
    "xenon",
    "zárda",
    "zebra",
    "zsalu",
    "zsidó",
    "ytong",
]
  const WORD_LENGTH = 5
  const FLIP_ANIMATION_DURATION = 500
  const DANCE_ANIMATION_DURATION = 500
  const keyboard = document.querySelector("[data-keyboard]")
  const alertContainer = document.querySelector("[data-alert-container]")
  const guessGrid = document.querySelector("[data-guess-grid]")
  const randomIndex = Math.floor(Math.random() * targetWords.length);
  const targetWord = targetWords[randomIndex];
  
  startInteraction()
  
  function startInteraction() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
  }
  
  function stopInteraction() {
    document.removeEventListener("click", handleMouseClick)
    document.removeEventListener("keydown", handleKeyPress)
  }
  
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

  
  function pressKey(key) {
    const activeTiles = getActiveTiles()
    if (activeTiles.length >= WORD_LENGTH) return
    const nextTile = guessGrid.querySelector(":not([data-letter])")
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key
    nextTile.dataset.state = "active"
  }
  
  function deleteKey() {
    const activeTiles = getActiveTiles();
    const lastTile = activeTiles[activeTiles.length - 1];
    if (lastTile == null) return;
    lastTile.textContent = "";
    lastTile.removeAttribute("data-state");
    lastTile.removeAttribute("data-letter");
  }
  
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
    const letter = tile.dataset.letter
    const key = keyboard.querySelector(`[data-key="${letter}"i]`)
    setTimeout(() => {
      tile.classList.add("flip")
    }, (index * FLIP_ANIMATION_DURATION) / 2)
  
    tile.addEventListener(
      "transitionend",
      () => {
        tile.classList.remove("flip")
        if (targetWord[index] === letter) {
          tile.dataset.state = "correct"
          key.classList.add("correct")
        } else if (targetWord.includes(letter)) {
          tile.dataset.state = "wrong-location"
          key.classList.add("wrong-location")
        } else {
          tile.dataset.state = "wrong"
          key.classList.add("wrong")
        }
  
        if (index === array.length - 1) {
          tile.addEventListener(
            "transitionend",
            () => {
              startInteraction()
              checkWinLose(guess, array)
            },
            { once: true }
          )
        }
      },
      { once: true }
    )
  }
  
  function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
  }
  
  function showAlert(message, duration = 1000) {
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    alertContainer.prepend(alert)
    if (duration == null) return
  
    setTimeout(() => {
      alert.classList.add("hide")
      alert.addEventListener("transitionend", () => {
        alert.remove()
      })
    }, duration)
  }
  
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
  
  function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
      showAlert("Nyertél, gratulálok!", 5000)
      danceTiles(tiles)
      stopInteraction()
      return
    }
  
    const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
      showAlert(targetWord.toUpperCase(), null)
      stopInteraction()
    }
  }
  
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


const showPopup = document.querySelector('.show-popup');
const popupContainer = document.querySelector('.popup-container');
const closeBtn = document.querySelector('.close-btn');

showPopup.onclick = () => {
  popupContainer.classList.add('active');
}

closeBtn.onclick = () => {
  popupContainer.classList.remove('active');
}