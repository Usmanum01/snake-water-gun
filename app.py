"""
Snake, Water, Gun - Flask backend

This is your original game logic, unchanged, just wrapped so the
frontend (HTML/CSS/JS) can call it over an API instead of using input().
"""

import random
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# 1 for snake, -1 for water, 0 for gun
YOU_DICT = {"s": 1, "w": -1, "g": 0}
REVERSE_DICT = {1: "Snake", -1: "Water", 0: "Gun"}


def play_round(you_str):
    """
    Same logic as the original script:
      - computer picks randomly from [-1, 0, 1]
      - result decided using the (computer - you) trick
    Returns a dict describing what happened.
    """
    if you_str not in YOU_DICT:
        return {"error": f"Invalid choice: {you_str}"}

    computer = random.choice([-1, 0, 1])
    you = YOU_DICT[you_str]

    if computer == you:
        outcome = "draw"
        message = "It's a draw"
    else:
        diff = computer - you
        if diff == -1 or diff == 2:
            outcome = "win"
            message = "You win!"
        else:
            outcome = "lose"
            message = "You lose!"

    return {
        "you_choice": REVERSE_DICT[you],
        "you_key": you_str,
        "computer_choice": REVERSE_DICT[computer],
        "computer_key": {1: "s", -1: "w", 0: "g"}[computer],
        "outcome": outcome,   # "win" | "lose" | "draw"
        "message": message,
    }


@app.route("/")
def index():
    """Serves the frontend page."""
    return render_template("index.html")


@app.route("/api/play", methods=["POST"])
def api_play():
    """
    Frontend calls this endpoint with JSON: {"choice": "s" | "w" | "g"}
    Backend (this Python file) runs the actual game logic and
    returns the result as JSON.
    """
    data = request.get_json(silent=True) or {}
    choice = data.get("choice", "")
    result = play_round(choice)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result)


if __name__ == "__main__":
    # Runs on http://127.0.0.1:5000
    app.run(debug=True)
