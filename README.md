# Snake, Water, Gun — Web App

- **Backend:** `app.py` (Python/Flask) — runs your original game logic
- **Frontend:** `templates/index.html` + `static/style.css` + `static/script.js`

The frontend sends your choice to the backend over `/api/play`,
Python decides the winner, and sends the result back as JSON.

## Run it

```bash
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000 in your browser.
