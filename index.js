const gameboard = document.querySelector('.gameboard'),
      result = document.querySelector('.result'),
      startButton = document.querySelector('.start-game'),
      visibleClass = 'visible',
      cardFlipTimeout = 500;

const cardElements = ['🎓', '🧢', '📿', '💄', '💍', '💎'],
      boardSize = 12;

let visibleCards = [];

startButton.addEventListener('click', startGame);

function startGame() {
    [gameboard, result].forEach(elem => elem.innerHTML = '');

    const cards = genBoard(cardElements, boardSize);

    cards.forEach(renderCard);

    const renderedCards = document.querySelectorAll(".card");
    renderedCards.forEach(card => card.classList.add(visibleClass));

    setTimeout(() => {
        renderedCards.forEach(card => card.classList.remove(visibleClass))
      }, cardFlipTimeout * 2);
}

function genBoard(elements, size) {
    const randCards = [],
          counts = {};
    
    elements.forEach(elem => counts[elem] = 0);

    while (randCards.length < size) {
        const randElem = elements[Math.floor(Math.random() * elements.length)];

        if (counts[randElem] < 2) {
            randCards.push(randElem);
            counts[randElem]++;
        }
    }

    return randCards;
}

function renderCard(element = '') {
    const card = document.createElement("div"),
          cardInner = document.createElement("div"),
          cardFront = document.createElement("div"),
          cardBack = document.createElement("div");
    
    card.classList.add('card');
    cardInner.classList.add('card-inner');
    cardFront.classList.add('card-front');
    cardBack.classList.add('card-back');

    cardBack.textContent = '';
    cardBack.textContent = element;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    card.appendChild(cardInner);
    
    card.addEventListener("click", handleCardClick.bind(this, card));

    gameboard.appendChild(card);
}

function handleCardClick(card) {
    if (card.classList.contains(visibleClass)) {
        return;
    }

    const checkVictory = () => {
        const visibleCardsNodes = document.querySelectorAll(`.${visibleClass}`);

        if (visibleCardsNodes.length === boardSize) {
            result.textContent = "You Win!";
        }
    };

    card.querySelector(".card-inner").addEventListener("transitionend", checkVictory);

    card.classList.add(visibleClass);
    visibleCards.push(card);

    if (visibleCards.length % 2 !== 0) {
        return;
    }

    const [prelastCard, lastCard] = visibleCards.slice(-2);

    if (lastCard.textContent !== prelastCard.textContent) {
        visibleCards = visibleCards.slice(0, visibleCards.length - 2);

        setTimeout(() => {
        [lastCard, prelastCard].forEach((card) =>
            card.classList.remove(visibleClass)
        )
        }, cardFlipTimeout);
    }
}

startGame();