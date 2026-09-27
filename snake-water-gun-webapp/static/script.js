const ICON = { s: "🐍", w: "💧", g: "🔫" };

let score = { you: 0, cpu: 0, ties: 0 };

const $ = (id) => document.getElementById(id);

function updateScore() {
  $("scoreYou").textContent = score.you;
  $("scoreCpu").textContent = score.cpu;
  $("scoreTies").textContent = score.ties;
}

async function play(choiceKey) {
  $("hint").textContent = "Asking the server...";

  try {
    const res = await fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice: choiceKey }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    $("iconYou").textContent = ICON[data.you_key];
    $("iconCpu").textContent = ICON[data.computer_key];

    const resultEl = $("resultText");
    resultEl.classList.remove("win", "lose", "draw");

    if (data.outcome === "draw") {
      resultEl.textContent = `Draw — you both chose ${data.you_choice}`;
      resultEl.classList.add("draw");
      score.ties++;
    } else if (data.outcome === "win") {
      resultEl.textContent = `You win — ${data.you_choice} beats ${data.computer_choice}`;
      resultEl.classList.add("win");
      score.you++;
    } else {
      resultEl.textContent = `You lose — ${data.computer_choice} beats ${data.you_choice}`;
      resultEl.classList.add("lose");
      score.cpu++;
    }

    $("hint").textContent = "Play again";
    updateScore();
  } catch (err) {
    $("hint").textContent = "Couldn't reach the server. Is app.py running?";
    console.error(err);
  }
}

document.querySelectorAll("button.choice").forEach((btn) => {
  btn.addEventListener("click", () => play(btn.dataset.k));
});

document.getElementById("resetBtn").addEventListener("click", () => {
  score = { you: 0, cpu: 0, ties: 0 };
  updateScore();
  $("iconYou").textContent = "?";
  $("iconCpu").textContent = "?";
  $("resultText").textContent = "";
  $("resultText").classList.remove("win", "lose", "draw");
  $("hint").textContent = "Pick one below to play";
});
