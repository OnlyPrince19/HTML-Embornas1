// === QUIZ DATA ===
const quizData = [
  {
    question: "What does 'let' declare in JavaScript?",
    options: ["A constant value", "A changeable variable", "A function", "An array"],
    correct: 1
  },
  {
    question: "Which is the strict equality operator?",
    options: ["==", "=", "===", "!="],
    correct: 2
  },
  {
    question: "What is the purpose of a for loop?",
    options: ["To declare variables", "To repeat code a set number of times", "To handle events", "To style elements"],
    correct: 1
  },
  {
    question: "How do you select an element by ID in the DOM?",
    options: ["querySelector", "getElementById", "createElement", "appendChild"],
    correct: 1
  },
  // You can add more custom questions here!
  {
    question: "What keyword stops a loop early?",
    options: ["exit", "stop", "break", "return"],
    correct: 2
  },
  {
    question: "What does DOM stand for?",
    options: ["Document Object Model", "Data Object Method", "Display Output Module", "Document Option Mode"],
    correct: 0
  }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = -1;
let totalQuestions = quizData.length;
let timeLeft = 30;
let timerInterval;
let highScore = localStorage.getItem('jsQuizHighScore') || 0;

// === UPDATE PROGRESS ===
function updateProgress() {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
  document.getElementById('current-q').textContent = currentQuestion + 1;
  document.getElementById('total-q').textContent = totalQuestions;
}

// === TIMER ===
function startTimer() {
  timeLeft = 30;
  document.getElementById('timer-container').style.display = 'block';
  document.getElementById('timer-text').textContent = timeLeft;
  document.getElementById('timer-fill').style.width = '100%';
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-fill').style.width = (timeLeft / 30 * 100) + '%';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    document.getElementById('timer-container').style.display = 'none';
  }
}

// === LOAD QUESTION ===
function loadQuestion() {
  const q = quizData[currentQuestion];
  document.getElementById('question').textContent = q.question;
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  q.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.classList.add('option');
    btn.onclick = () => selectOption(i);
    optionsDiv.appendChild(btn);
  });
  document.getElementById('next-btn').style.display = 'none';
  updateProgress();
  startTimer();
}

// === SELECT OPTION ===
function selectOption(index) {
  if (selectedAnswer !== -1) return;
  selectedAnswer = index;
  clearTimer();
  const options = document.querySelectorAll('.option');
  options.forEach((opt, i) => {
    opt.disabled = true;
    if (i === quizData[currentQuestion].correct) opt.classList.add('correct');
    else if (i === index) opt.classList.add('incorrect');
  });
  document.getElementById('next-btn').style.display = 'block';
}

// === NEXT QUESTION ===
function nextQuestion() {
  if (selectedAnswer === quizData[currentQuestion].correct) score++;
  currentQuestion++;
  selectedAnswer = -1;
  if (currentQuestion < totalQuestions) loadQuestion();
  else showScore();
}

// === SHOW SCORE ===
function showScore() {
  clearTimer();
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('score-container').style.display = 'block';
  document.getElementById('score-circle-text').textContent = score;
  document.getElementById('total-score').textContent = totalQuestions;

  const percentage = Math.round((score / totalQuestions) * 100);
  let feedback = "";
  if (percentage >= 80) feedback = "Outstanding! You're a JavaScript wizard. 🌟";
  else if (percentage >= 60) feedback = "Well done! Keep practicing those concepts. 👍";
  else feedback = "Good start—review the notes and try again. 📚";
  document.getElementById('feedback').textContent = feedback;

  // High score system
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('jsQuizHighScore', highScore);
  }
  document.getElementById('high-score').style.display = 'block';
  document.getElementById('high-score-val').textContent = highScore;
}

// === RESTART ===
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = -1;
  document.getElementById('score-container').style.display = 'none';
  document.getElementById('question-container').style.display = 'block';
  loadQuestion();
}

// === INIT ===
document.addEventListener('DOMContentLoaded', loadQuestion);
