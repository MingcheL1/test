const stages = [
  {
    name: "Within 10",
    enemy: "Waddle Dee",
    totalQuestions: 10,
    generateQuestion() {
      const add = Math.random() > 0.5;
      if (add) {
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
    name: "Within 20",
    enemy: "Bronto Burt",
    totalQuestions: 10,
    generateQuestion() {
      const add = Math.random() > 0.5;
      if (add) {
        const a = randomInt(0, 20);
        const b = randomInt(0, 20 - a);
        return { prompt: `${a} + ${b} = ?`, answer: a + b };
      }
      const a = randomInt(0, 20);
      const b = randomInt(0, a);
      return { prompt: `${a} - ${b} = ?`, answer: a - b };
    },
  },
  {
    name: "Within 100",
    enemy: "King Dedede",
    totalQuestions: 10,
    generateQuestion() {
      const add = Math.random() > 0.5;
      if (add) {
        const a = randomInt(0, 100);
        const b = randomInt(0, 100 - a);
        return { prompt: `${a} + ${b} = ?`, answer: a + b };
      }
      const a = randomInt(0, 100);
      const b = randomInt(0, a);
      return { prompt: `${a} - ${b} = ?`, answer: a - b };
    },
  },
  {
    name: "Single Digit Multiply",
    enemy: "Meta Knight",
    totalQuestions: 10,
    generateQuestion() {
      const a = randomInt(1, 9);
      const b = randomInt(1, 9);
      return { prompt: `${a} × ${b} = ?`, answer: a * b };
    },
  },
  {
    name: "Single Digit Divide",
    enemy: "Nightmare",
    totalQuestions: 10,
    generateQuestion() {
      const divisor = randomInt(1, 9);
      const quotient = randomInt(1, 9);
      const dividend = divisor * quotient;
      return { prompt: `${dividend} ÷ ${divisor} = ?`, answer: quotient };
    },
  },
];

const state = { stageIndex: 0, questionIndex: 0, score: 0, lives: 3, currentQuestion: null };

const el = {
  stageBadge: document.querySelector("#stage-badge"),
  stageName: document.querySelector("#stage-name"),
  questionIndex: document.querySelector("#question-index"),
  score: document.querySelector("#score"),
  hearts: document.querySelector("#hearts"),
  stars: document.querySelector("#stars"),
  enemy: document.querySelector("#enemy-name"),
  bossHp: document.querySelector("#boss-hp"),
  kirbyMessage: document.querySelector("#kirby-message"),
  kirbyAvatar: document.querySelector("#kirby-avatar"),
  question: document.querySelector("#question"),
  answer: document.querySelector("#answer"),
  feedback: document.querySelector("#feedback"),
  celebration: document.querySelector("#celebration"),
  submitBtn: document.querySelector("#submit-btn"),
  nextBtn: document.querySelector("#next-btn"),
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function heartsText(count) {
  return "❤️".repeat(count) + "🖤".repeat(3 - count);
}

function currentStage() {
  return stages[state.stageIndex];
}

function updateHud() {
  const stage = currentStage();
  el.stageBadge.textContent = `Stage ${state.stageIndex + 1}`;
  el.stageName.textContent = stage.name;
  el.questionIndex.textContent = String(state.questionIndex + 1);
  el.score.textContent = String(state.score);
  el.hearts.textContent = heartsText(state.lives);
  el.stars.textContent = "✨".repeat(Math.max(1, Math.floor(state.score / 30) + 1));
  el.enemy.textContent = stage.enemy;
  el.bossHp.max = stage.totalQuestions;
  el.bossHp.value = stage.totalQuestions - state.questionIndex;
}

function showCelebration() {
  el.celebration.classList.remove("show");
  void el.celebration.offsetWidth;
  el.celebration.classList.add("show");
  el.kirbyAvatar.classList.add("power");
  setTimeout(() => el.kirbyAvatar.classList.remove("power"), 250);
}

function setMessage(text) {
  el.kirbyMessage.textContent = text;
}

function loadQuestion() {
  const stage = currentStage();
  state.currentQuestion = stage.generateQuestion();
  el.question.textContent = state.currentQuestion.prompt;
  el.answer.value = "";
  el.feedback.textContent = "";
  el.submitBtn.disabled = false;
  el.nextBtn.disabled = true;
  updateHud();
  el.answer.focus();
}

function endGame(win) {
  el.submitBtn.disabled = true;
  el.nextBtn.disabled = true;
  if (win) {
    el.question.textContent = "🏆 Kirby saved Dream Land!";
    el.feedback.textContent = `Amazing! Final score: ${state.score}`;
    setMessage("Poyo poyo! You beat all 5 stages!");
  } else {
    el.question.textContent = "Game Over";
    el.feedback.textContent = `Final score: ${state.score}`;
    setMessage("Kirby says: Try again! You can do it!");
  }
}

function nextStage() {
  state.stageIndex += 1;
  state.questionIndex = 0;

  if (state.stageIndex >= stages.length) {
    endGame(true);
    return;
  }

  setMessage(`Stage ${state.stageIndex + 1} begins! ${currentStage().enemy} appears!`);
  loadQuestion();
}

function checkAnswer() {
  if (!state.currentQuestion) {
    return;
  }

  const value = Number(el.answer.value);
  if (Number.isNaN(value)) {
    el.feedback.textContent = "Type a number first!";
    return;
  }

  if (value === state.currentQuestion.answer) {
    state.score += 10;
    el.feedback.textContent = "✅ Perfect hit!";
    setMessage("Kirby used Star Blast! Great job!");
    showCelebration();
  } else {
    state.lives -= 1;
    el.feedback.textContent = `❌ Miss! Correct: ${state.currentQuestion.answer}`;
    setMessage("Oof! Keep going, hero!");
  }

  state.questionIndex += 1;
  updateHud();
  el.submitBtn.disabled = true;
  el.nextBtn.disabled = false;

  if (state.lives <= 0) {
    endGame(false);
  }
}

function nextTurn() {
  if (state.lives <= 0) {
    return;
  }

  if (state.questionIndex >= currentStage().totalQuestions) {
    nextStage();
  } else {
    loadQuestion();
  }
}

el.submitBtn.addEventListener("click", checkAnswer);
el.nextBtn.addEventListener("click", nextTurn);
el.answer.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (!el.submitBtn.disabled) {
      checkAnswer();
    } else if (!el.nextBtn.disabled) {
      nextTurn();
    }
  }
});

loadQuestion();
