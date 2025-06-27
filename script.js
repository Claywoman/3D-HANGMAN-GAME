// Game variables
let selectedWord = "";
let guessedLetters = [];
let mistakes = 0;
let maxMistakes = 6;
let currentCategory = "";
let currentDifficulty = "";

let timerInterval;
let timeLeft = 0;

// DOM elements
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const keyboard = document.getElementById('keyboard');
const categoryDisplay = document.getElementById('category-display');
const wordDisplay = document.getElementById('word-display');
const messageDisplay = document.getElementById('message');
const guessesLeftDisplay = document.getElementById('guesses-left');
const hangmanContainer = document.getElementById('hangman-container');
const timerDisplay = document.getElementById('timer');

// Audio elements
const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const drawSound = document.getElementById('draw-sound');

// Sound functions
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Audio play error:", e));
}

function playWinSound() {
    winSound.currentTime = 0;
    winSound.play().catch(e => console.log("Audio play error:", e));
}

function playLoseSound() {
    loseSound.currentTime = 0;
    loseSound.play().catch(e => console.log("Audio play error:", e));
}

function playDrawSound() {
    drawSound.currentTime = 0;
    drawSound.play().catch(e => console.log("Audio play error:", e));
}

// Word banks
const wordBanks = {
    animals: {
        easy: ["TIGER", "PANDA", "ZEBRA", "EAGLE", "KOALA", "BEAR", "CAT", "DOG", "LAMB", "MOLE"],
        medium: ["GIRAFFE", "LEOPARD", "PENGUIN", "OCTOPUS", "PEACOCK", "WALRUS", "JAGUAR", "DOLPHIN", "FLAMINGO", "WOODPECKER", "KANGAROO", "HYENA", "CHIMP", "OTTER", "BUFFALO", "BISON", "SWALLOW", "FERRET", "GOLDFISH", "STORK"],
        hard: ["RHINOCEROS", "HIPPOPOTAMUS", "CHAMELEON", "PLATYPUS", "ARMADILLO", "AXOLOTL", "CATERPILLAR", "COCKROACH", "SQUIRREL", "CROCODILE", "ALLIGATOR", "HEDGEHOG", "PORCUPINE", "WILDEBEEST", "NARWHAL", "TARANTULA", "OSTRICH", "WOMBAT", "GECKO", "RACCOON", "MONGOOSE", "MEERKAT", "SKUNK", "IBEX", "QUOKKA", "ANTELOPE", "MACAQUE", "LIZARD", "BAT", "WASP"]
    },
    countries: {
        easy: ["CHINA", "SPAIN", "ITALY", "INDIA", "EGYPT", "CHILE", "PERU", "IRAQ", "IRAN", "KENYA"],
        medium: ["FINLAND", "CANADA", "SWEDEN", "AUSTRIA", "TURKEY", "POLAND", "BELGIUM", "DENMARK", "MEXICO", "JAPAN", "NORWAY", "ISRAEL", "GREECE", "PORTUGAL", "MOROCCO", "VIETNAM", "CUBA", "BRAZIL", "NEPAL", "THAILAND"],
        hard: ["LIECHTENSTEIN", "KAZAKHSTAN", "UZBEKISTAN", "KIRIBATI", "ESWATINI", "DJIBOUTI", "MAURITIUS", "GUATEMALA", "MOZAMBIQUE", "SINGAPORE", "BANGLADESH", "SLOVAKIA", "SLOVENIA", "BULGARIA", "ARMENIA", "GEORGIA", "MALAYSIA", "ECUADOR", "ZIMBABWE", "NIGERIA", "VENEZUELA", "SENEGAL", "SURINAME", "NICARAGUA", "CAMBODIA", "BOLIVIA", "ESTONIA", "LATVIA", "LITHUANIA", "PARAGUAY"]
    },
    tech: {
        easy: ["PHONE", "CABLE", "ROBOT", "MOUSE", "LAPTOP", "RADIO", "DRONE", "EMAIL", "VIRUS", "CLOUD"],
        medium: ["COMPUTER", "PRINTER", "MONITOR", "TABLET", "KEYBOARD", "GADGET", "CHARGER", "MODEM", "BROWSER", "CAMERA", "SPEAKER", "JOYSTICK", "STORAGE", "WIFI", "SERVER", "SOFTWARE", "HACKER", "NETWORK", "GAMING", "PYTHON"],
        hard: ["MICROPROCESSOR", "ARTIFICIAL", "INTELLIGENCE", "ALGORITHM", "QUANTUM", "ENCRYPTION", "CYBERSECURITY", "BLOCKCHAIN", "DATABASE", "NANOTECHNOLOGY", "AUTOMATION", "BIOMETRICS", "FIRMWARE", "PROTOCOL", "MACHINELEARNING", "INTERFACE", "VIRTUALREALITY", "AUGMENTED", "WEBSERVER", "MAINFRAME", "MOTHERBOARD", "EMBEDDED", "PROGRAMMING", "OPERATINGSYSTEM", "NEURALNETWORK", "SIMULATION", "MALWARE", "BACKEND", "FRONTEND", "WIRELESS"]
    },
    food: {
        easy: ["BREAD", "PASTA", "PIZZA", "APPLE", "GRAPE", "CAKE", "RICE", "EGGS", "SOUP", "FISH"],
        medium: ["BURRITO", "LASAGNA", "PINEAPPLE", "SAUSAGE", "MEATBALL", "PANCAKE", "MUFFINS", "CABBAGE", "CROISSANT", "SANDWICH", "AVOCADO", "CUCUMBER", "PUMPKIN", "CHICKEN", "CEREAL", "BISCUIT", "WAFFLES", "SPINACH", "TOASTED", "PICKLES"],
        hard: ["RATATOUILLE", "SOUFFLE", "GUACAMOLE", "BOLOGNESE", "CARPACCIO", "TZATZIKI", "QUESADILLA", "TAGINE", "SASHIMI", "WONTON", "PAELLA", "GNOCCHI", "TAPIOCA", "HUMMUS", "TEMPURA", "BRUSCHETTA", "FETTUCCINE", "MOZZARELLA", "GAZPACHO", "VINDALOO", "ENCHILADAS", "BOUILLABAISSE", "KIMCHI", "KABSA", "YAKITORI", "JAMBALAYA", "SUKIYAKI", "TIRAMISU", "BIBIMBAP", "MANICOTTI"]
    },
    games: {
        easy: ["CHESS", "POKER", "TETRIS", "UNO", "PACMAN", "DARTS", "TAG", "HIDE", "GO", "RISK"],
        medium: ["MONOPOLY", "FORTNITE", "MINECRAFT", "CHECKERS", "ROULETTE", "BALDERDASH", "DOMINOES", "CLUELESS", "SCRABBLE", "SPOTIFY", "BINGO", "SUDOKU", "BACKGAMMON", "CANDYLAND", "MAHJONG", "PINOCHLE", "FARKLE", "JENGA", "YAHTZEE", "HANGMAN"],
        hard: ["DUNGEONCRAWLER", "COUNTERSTRIKE", "OVERWATCH", "DRAKENGARD", "CASTLEVANIA", "LEAGUEOFLEGENDS", "FINALFANTASY", "GHOSTOFTSUSHIMA", "ZELDABREATH", "GEARSOFWAR", "BATTLEFIELD", "VALORANT", "WITCHERTHREE", "PORTALGAME", "TERRARIA", "HOLLOWKNIGHT", "BLOODBORNE", "DARKSOULS", "GODOFWAR", "MORTALKOMBAT", "METROIDPRIME", "CYBERPUNK", "EARTHTWORMJIM", "STARDEWVALLEY", "ASSASSINSCREED", "FALLOUTFOUR", "BIOSHOCK", "BAYONETTA", "DESTINYTWO", "SPIDERMAN"]
    }
};

// Initialize the game
function init() {
    createHangmanDrawing();
    setupEventListeners();
    // Ensure setup screen is active on load
    setupScreen.classList.add('active');
    gameScreen.classList.remove('active');
}

// Timer Functions
function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            messageDisplay.textContent = `TIME'S UP! WORD: ${selectedWord}`;
            messageDisplay.className = 'message lose';
            playLoseSound();
            setTimeout(() => {
                setupScreen.classList.add('active');
                gameScreen.classList.remove('active');
            }, 3000);
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `TIME LEFT: ${timeLeft}s`;
}

// Setup event listeners
function setupEventListeners() {
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            playClickSound();
            currentCategory = button.dataset.category;
            categoryDisplay.textContent = `CATEGORY: ${currentCategory.toUpperCase()}`;
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.addEventListener('click', () => {
            playClickSound();
            currentDifficulty = button.dataset.difficulty;
            document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    startBtn.addEventListener('click', () => {
        playClickSound();
        if (!currentCategory || !currentDifficulty) {
            alert("Please select both a category and difficulty!");
            return;
        }
        startGame();
    });
}

// Start the game
function startGame() {
    switch (currentDifficulty) {
        case 'easy':
            maxMistakes = 8;
            timeLeft = 60;
            break;
        case 'medium':
            maxMistakes = 6;
            timeLeft = 45;
            break;
        case 'hard':
            maxMistakes = 4;
            timeLeft = 30;
            break;
    }

    const categoryWords = wordBanks[currentCategory][currentDifficulty];
    selectedWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    guessedLetters = [];
    mistakes = 0;

    messageDisplay.textContent = '';
    messageDisplay.className = 'message';
    wordDisplay.textContent = '_ '.repeat(selectedWord.length);
    guessesLeftDisplay.textContent = `GUESSES LEFT: ${maxMistakes - mistakes}`;

    setupScreen.classList.remove('active');
    gameScreen.classList.add('active');

    createKeyboard();
    resetHangmanDrawing();
    startTimer();
}

// Game functions
function handleGuess(letter) {
    playClickSound();
    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    const letterButtons = document.querySelectorAll(`.keyboard button[data-letter="${letter}"]`);
    letterButtons.forEach(button => button.disabled = true);

    if (!selectedWord.includes(letter)) {
        mistakes++;
        playDrawSound();
        updateHangman();
        letterButtons.forEach(button => button.classList.add('incorrect'));
    } else {
        letterButtons.forEach(button => button.classList.add('correct'));
    }

    updateWordDisplay();
    checkGameStatus();
}

function updateWordDisplay() {
    let displayWord = '';
    let allLettersGuessed = true;

    for (const letter of selectedWord) {
        if (guessedLetters.includes(letter)) {
            displayWord += `${letter} `;
        } else {
            displayWord += '_ ';
            allLettersGuessed = false;
        }
    }

    wordDisplay.textContent = displayWord.trim();
    guessesLeftDisplay.textContent = `GUESSES LEFT: ${maxMistakes - mistakes}`;

    if (allLettersGuessed) {
        clearInterval(timerInterval);
        messageDisplay.textContent = 'YOU WIN!';
        messageDisplay.className = 'message win';
        playWinSound();
        setTimeout(() => {
            setupScreen.classList.add('active');
            gameScreen.classList.remove('active');
        }, 3000);
    }
}

function checkGameStatus() {
    if (mistakes >= maxMistakes) {
        clearInterval(timerInterval);
        messageDisplay.textContent = `GAME OVER! WORD: ${selectedWord}`;
        messageDisplay.className = 'message lose';
        playLoseSound();
        setTimeout(() => {
            setupScreen.classList.add('active');
            gameScreen.classList.remove('active');
        }, 3000);
    }
}

function createKeyboard() {
    keyboard.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    letters.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.dataset.letter = letter;
        button.addEventListener('click', () => handleGuess(letter));
        keyboard.appendChild(button);
    });
}

function createHangmanDrawing() {
    const parts = [
        { name: 'gallows', className: 'gallows' },
        { name: 'head', className: 'head hangman-part' },
        { name: 'body', className: 'body hangman-part' },
        { name: 'left-arm', className: 'left-arm hangman-part' },
        { name: 'right-arm', className: 'right-arm hangman-part' },
        { name: 'left-leg', className: 'left-leg hangman-part' },
        { name: 'right-leg', className: 'right-leg hangman-part' }
    ];

    parts.forEach(part => {
        const element = document.createElement('div');
        element.className = part.className;
        element.id = part.name;
        hangmanContainer.appendChild(element);
    });
}

function resetHangmanDrawing() {
    document.querySelectorAll('.hangman-part').forEach(part => {
        part.style.opacity = '0';
    });
}

function updateHangman() {
    const parts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
    if (mistakes > 0 && mistakes <= parts.length) {
        const part = document.getElementById(parts[mistakes - 1]);
        part.style.opacity = '1';
    }
}


/* ======================================================= */
/* START: MODAL SCRIPT */
/* ======================================================= */

// Wait for the document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Call the game initialization function
    init(); // MERGED: Call init() here

    // Get the necessary elements from the DOM
    const policyModal = document.getElementById('policy-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const openPolicyBtn = document.getElementById('open-policy-btn');
    const closeButtons = document.querySelectorAll('.close-btn'); // Select all close buttons

    // Elements for How To Play Modal
    const instructionsModal = document.getElementById('instructions-modal');
    const openInstructionsBtn = document.getElementById('open-instructions-btn');

    // Function to close any active modal
    const closeModal = () => {
        // Find any open modal and hide it
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
            modal.classList.add('hidden');
        });
        modalOverlay.classList.add('hidden'); // Hide the single overlay
    };

    // Event Listeners for policy modal
    openPolicyBtn.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal(); // Close any other open modal first
        policyModal.classList.remove('hidden');
        modalOverlay.classList.remove('hidden');
    });

    // Event Listener for How To Play modal
    openInstructionsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal(); // Close any other open modal first
        instructionsModal.classList.remove('hidden');
        modalOverlay.classList.remove('hidden');
    });

    // Event Listeners for closing modals (generalized)
    // Close any modal when ANY 'X' button is clicked
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close any modal when the background overlay is clicked
    modalOverlay.addEventListener('click', closeModal);
    
    // Close any modal when the 'Escape' key is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
            closeModal();
        }
    });
});