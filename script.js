const levels = [
  {
    name: "Easy",
    totalQuestions: 5,
    generateQuestion() {
      const isAddition = Math.random() > 0.5;
      if (isAddition) {
        const a = randomInt(0, 10);
        const b = randomInt(0, 10 - a);
        return { prompt: `${a} + ${b} = ?`, answer: a + b };
      }

      const a = randomInt(0, 10);
      const b = randomInt(0, a);
      return { prompt: `${a} - ${b} = ?`, answer: a - b };
    },
  },
  {
    name: "Medium",
    totalQuestions: 5,
    generateQuestion() {
      const isAddition = Math.random() > 0.5;
      if (isAddition) {
        const a = randomInt(11, 60);
        const b = randomInt(11, 100 - a);
        return { prompt: `${a} + ${b} = ?`, answer: a + b };
      }

      const a = randomInt(20, 100);
      const b = randomInt(11, a - 1);
      return { prompt: `${a} - ${b} = ?`, answer: a - b };
    },
  },
  {
    name: "Hard",
    totalQuestions: 8,
    generateQuestion() {
      const a = randomInt(1, 9);
      const b = randomInt(1, 9);
      return { prompt: `${a} × ${b} = ?`, answer: a * b };
    },
  },
];

const state = {
  levelIndex: 0,
  questionIndex: 0,
  score: 0,
  hearts: 3,
  currentQuestion: null,
};

const el = {
  levelName: document.querySelector("#level-name"),
  questionIndex: document.querySelector("#question-index"),
  questionTotal: document.querySelector("#question-total"),
  score: document.querySelector("#score"),
  hearts: document.querySelector("#hearts"),
  kirbyMessage: document.querySelector("#kirby-message"),
  question: document.querySelector("#question"),
  answer: document.querySelector("#answer"),
  feedback: document.querySelector("#feedback"),
  submitBtn: document.querySelector("#submit-btn"),
  nextBtn: document.querySelector("#next-btn"),
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function heartsText(count) {
  return "❤️".repeat(count) + "🖤".repeat(3 - count);
}

function getLevel() {
  return levels[state.levelIndex];
}

function updateHud() {
  const level = getLevel();
  el.levelName.textContent = level.name;
  el.questionIndex.textContent = String(state.questionIndex + 1);
  el.questionTotal.textContent = String(level.totalQuestions);
  el.score.textContent = String(state.score);
  el.hearts.textContent = heartsText(state.hearts);
}

function setKirbyMessage(text) {
  el.kirbyMessage.textContent = text;
}

function loadQuestion() {
  const level = getLevel();
  state.currentQuestion = level.generateQuestion();
  el.question.textContent = state.currentQuestion.prompt;
  el.answer.value = "";
  el.feedback.textContent = "";
  el.submitBtn.disabled = false;
  el.nextBtn.disabled = true;
  el.answer.focus();
  updateHud();
}

function advanceLevel() {
  state.levelIndex += 1;
  state.questionIndex = 0;

  if (state.levelIndex >= levels.length) {
    el.question.textContent = "🎉 You beat every level!";
    el.feedback.textContent = `Final score: ${state.score}`;
    setKirbyMessage("Poyo! You're a math superstar! 🌟");
    el.submitBtn.disabled = true;
    el.nextBtn.disabled = true;
    return;
  }

  const next = getLevel().name;
  setKirbyMessage(`Great job! Welcome to ${next} mode!`);
  loadQuestion();
}

function checkAnswer() {
  if (!state.currentQuestion) {
    return;
  }

  const value = Number(el.answer.value);
  if (Number.isNaN(value)) {
    el.feedback.textContent = "Please type a number first.";
    return;
  }

  if (value === state.currentQuestion.answer) {
    state.score += 10;
    el.feedback.textContent = "✅ Correct! Kirby is happy!";
    setKirbyMessage("Yay! Keep going, math hero! ⭐");
  } else {
    state.hearts -= 1;
    el.feedback.textContent = `❌ Oops! Correct answer: ${state.currentQuestion.answer}`;
    setKirbyMessage("You got this! Try the next one! 💪");
  }

  state.questionIndex += 1;
  updateHud();
  el.submitBtn.disabled = true;
  el.nextBtn.disabled = false;

  if (state.hearts <= 0) {
    el.question.textContent = "Game over!";
    el.feedback.textContent = `Kirby believes in you. Score: ${state.score}`;
    setKirbyMessage("Let's play again and beat that score! 💖");
    el.nextBtn.disabled = true;
  }
}

function nextQuestion() {
  if (state.hearts <= 0) {
    return;
  }

  const level = getLevel();
  if (state.questionIndex >= level.totalQuestions) {
    advanceLevel();
    return;
  }

  loadQuestion();
}

el.submitBtn.addEventListener("click", checkAnswer);
el.nextBtn.addEventListener("click", nextQuestion);
el.answer.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (!el.submitBtn.disabled) {
      checkAnswer();
    } else if (!el.nextBtn.disabled) {
      nextQuestion();
    }
  }
});

loadQuestion();
