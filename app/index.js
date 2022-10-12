
const elements = {
	gameContainer: document.querySelector(".app__game-container"),
	gameBoard: document.querySelector(".app__game-board"),
	timer: document.querySelector('.app__timer'),
	winBody: document.querySelector('.app__win-body'),
	win: document.querySelector(".app__win"),
	timeInput: document.querySelector(".app__time-input"),
	start: document.querySelector(".app__start"),
}

const state = {
	flippedCard: 0,
	totalTime: 0,
	sec: 0,
}

const generateGame = () => {
	const emojis = ['🤣', '😅', '😆', '😁', '😄', '😀', '😇', '😊', '😉', '🙃']
	const picks = pickRandom(emojis, (4 * 4) / 2);
	const items = replace([...picks, ...picks]);
	const cards = `
	<div class="app__game-board">
	${items.map(item => `
		<div class="app__card" >
			<div class="app__front"></div>
			<div class="app__back">${item}</div>
		</div>
		`
	).join("")}
	</div>
	`
	const parser = new DOMParser().parseFromString(cards, "text/html");
	elements.gameBoard.replaceWith(parser.querySelector(".app__game-board"))
}

const pickRandom = (arr, size) => {
	let clonedArr = [...arr];
	let resultArr = [];

	for (let i = 0; i < size; i++) {
		const randomIndex = Math.floor(Math.random() * clonedArr.length)

		resultArr.push(clonedArr[randomIndex]);
		clonedArr.splice(randomIndex, 1)
	}
	return resultArr;
}

const replace = (arr) => {
	let clonedArr = [...arr]

	for (let i = clonedArr.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1))
		const orig = clonedArr[i];

		clonedArr[i] = clonedArr[randomIndex];
		clonedArr[randomIndex] = orig
	}

	return clonedArr
}

const attachEventListener = () => {
	document.addEventListener("click", event => {
		const eventTarget = event.target;
		const eventParent = eventTarget.parentElement
		if (eventTarget.className.includes('app__front') && !eventParent.className.includes("flipped")) {
			flipCard(eventParent);
		} else if (eventTarget.className.includes('app__again')) { document.location.reload(); }
		else if (eventTarget.className.includes('app__start')) {
			if (elements.timeInput.value == "") {
				alert("Enter a number of seconds")
			} else {
				state.sec = elements.timeInput.value;
				startGame()
			}

		};
	})
}
const flipCard = (card) => {
	state.flippedCard++

	if (state.flippedCard === 3) {
		flipBackCards()
	}
	if (state.flippedCard <= 2) {
		card.classList.add("flipped");
	};
	if (state.flippedCard == 2) {
		const flippedCard = document.querySelectorAll(".flipped:not(.matched)")

		if (flippedCard[0].innerText === flippedCard[1].innerText) {
			flippedCard[0].classList.add("matched")
			flippedCard[1].classList.add("matched")
		} else {
			flippedCard[0].classList.add("notMatched")
			flippedCard[1].classList.add("notMatched")
		}


	}
	if (!document.querySelectorAll('.app__card:not(.flipped)').length) {

		elements.win.style.visibility = "inherit";
		elements.winBody.innerHTML = `
			<h2>You win</h2>
			<button class="app__again">Try again!</button>
			 `
	}
}

const flipBackCards = () => {
	document.querySelectorAll('.app__card:not(.matched)').forEach(card => {
		card.classList.remove('flipped')
		card.classList.remove('notMatched')
	})

	state.flippedCard = 1

}
function timer() {
	function updateSec() {
		state.sec--;
		if (state.sec < 10) {
			elements.timer.innerHTML = `&nbsp${state.sec}`;
		} else {
			elements.timer.innerHTML = state.sec;
		}
		if (!document.querySelectorAll('.app__card:not(.flipped)').length) { stopTimer() }
		if (state.sec === 0) {
			elements.win.style.visibility = "inherit";
			elements.winBody.innerHTML = `
			<h2>You lose</h2>
			<button class="app__again">Try again!</button>
			 `
			stopTimer()
		}
	}

	updateSec();

	let interval = setInterval(updateSec, 1000);
	function stopTimer() {
		clearInterval(interval)
	}
}
const startGame = () => {
	elements.gameContainer.classList.remove("disabled")
	elements.timeInput.value = '';
	elements.timeInput.classList.add("disabled");
	elements.start.classList.add("disabled");
	timer();
}

attachEventListener()
generateGame()


