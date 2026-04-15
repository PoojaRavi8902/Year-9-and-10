
// =========================
// GLOBAL STATE
// =========================
let score = 0;
let answered = new Set();
let examSubmitted = false;
let timeLeft = 600; // 10 minutes

// =========================
// TIMER
// =========================
function startTimer() {
  const timerEl = document.getElementById("timer");
  if (!timerEl) return;

  const interval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(interval);
      submitExam();
      return;
    }

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timerEl.textContent =
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    timeLeft--;
  }, 1000);
}

// =========================
// LOAD QUESTIONS
// =========================
function loadQuestions(filter = "all") {
  const container = document.getElementById("questions");
  if (!container || typeof questions === "undefined") return;

  container.innerHTML = "";

  let filtered = questions.filter(q => filter === "all" || q.type === filter);

  const totalEl = document.getElementById("total");
  if (totalEl) totalEl.textContent = filtered.length;

  filtered.forEach((q, i) => {

    let html = `<div class="card">
    <p><b>Q${i+1}:</b> ${q.question}</p>`;

    if(q.type === "mcq") {
      q.options.forEach((opt, index) => {
        html += `
        <label>
          <input type="radio" name="q${i}" value="${index}">
          ${opt}
        </label><br>`;
      });

      html += `<button onclick="checkMCQ(${i})">Check</button>`;
    }

    else if(q.type === "fill") {
      html += `
      <input type="text" id="input${i}">
      <button onclick="checkFill(${i})">Check</button>`;
    }

    else {
      html += `
      <textarea id="input${i}"></textarea>
      <button onclick="showMark(${i})">Show Answer</button>`;
    }

    html += `<div id="result${i}"></div></div>`;

    container.innerHTML += html;
  });
}

// =========================
// FILTER
// =========================
function filterQuestions(type) {
  loadQuestions(type);
}

// =========================
// MCQ CHECK
// =========================
function checkMCQ(i) {
  if (examSubmitted) return;

  const selected = document.querySelector(`input[name="q${i}"]:checked`);
  const result = document.getElementById(`result${i}`);

  if (!selected) {
    result.innerHTML = "⚠️ Select an answer";
    return;
  }

  if (Number(selected.value) === questions[i].answer) {
    result.innerHTML = "<span class='correct'>✅ Correct</span>";
    if (!answered.has(i)) {
      score++;
      answered.add(i);
    }
  } else {
    result.innerHTML = "<span class='wrong'>❌ Incorrect</span>";
  }

  document.querySelectorAll(`input[name="q${i}"]`)
    .forEach(el => el.disabled = true);

  updateScore();
}

// =========================
// FILL CHECK
// =========================
function checkFill(i) {
  if (examSubmitted) return;

  const val = document.getElementById(`input${i}`).value.toLowerCase().trim();
  const correct = questions[i].answer;
  const result = document.getElementById(`result${i}`);

  let ok = Array.isArray(correct)
    ? correct.includes(val)
    : val === correct;

  if (ok) {
    result.innerHTML = "<span class='correct'>✅ Correct</span>";
    if (!answered.has(i)) {
      score++;
      answered.add(i);
    }
  } else {
    result.innerHTML = "<span class='wrong'>❌ Incorrect</span>";
  }

  document.getElementById(`input${i}`).disabled = true;

  updateScore();
}

// =========================
// SHOW MARK SCHEME
// =========================
function showMark(i) {
  const result = document.getElementById(`result${i}`);
  result.innerHTML = "<pre>" + questions[i].mark + "</pre>";
}

// =========================
// SCORE UPDATE
// =========================
function updateScore() {
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = score;
}

// =========================
// FINAL SCORE
// =========================
function showScore() {
  alert(`Final Score: ${score}/${questions.length}`);
}

// =========================
// SUBMIT EXAM
// =========================
function submitExam() {
  examSubmitted = true;

  document.querySelectorAll("input, textarea").forEach(el => {
    el.disabled = true;
  });

  alert(`Exam Submitted!\nScore: ${score}/${questions.length}`);
}

// =========================
// AUTO INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  loadQuestions();
  startTimer();
});
