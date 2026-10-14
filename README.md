# Multi-Signal Scam Shield

A fraud intelligence engine with three independent checks (message/link, UPI payee/QR, transaction) that combine into one explainable risk score, delivered through a React Native mobile app.

Built for the **AI and Fraud Detection** track of our hackathon.

## The problem

Most everyday fraud reaches people on their phones: scam SMS and WhatsApp messages, phishing links, fake QR codes and UPI "collect request" tricks. People usually find out something was fake only after they have paid. This project gives them a quick risk check, with reasons, before they act.

## What it does

The user gives the app something suspicious and gets back a **risk score (0-100)**, a **risk level** (low, medium, high) and a **plain-language list of reasons**.

| Check | Input | What it looks for |
|---|---|---|
| Message / link | Pasted SMS or WhatsApp text, or a URL | Urgent wording, fake KYC or bank prompts, lookalike domains |
| UPI payee / QR | Scanned QR code or UPI ID | Suspicious ID patterns, mismatched names, collect-request tricks |
| Transaction | Amount, time, payee details | Unusual amounts, odd hours, new payees |

A fusion step combines the three scores into one final score.

## How it works

```
React Native app  ->  FastAPI backend  ->  models + rules  ->  score + reasons
   (front door)          (the engine)
```

- The **app** collects input and shows the result.
- The **backend engine** holds the AI and exposes the endpoints described in [docs/api-contract.md](docs/api-contract.md).
- Because the engine is separate from the app, other financial projects can reuse it through the same API.

## Tech stack

| Layer | Choice |
|---|---|
| Mobile app | React Native with Expo |
| Backend | Python, FastAPI |
| ML | scikit-learn, XGBoost (optional: a fine-tuned transformer for messages) |
| Explainability | Top features and SHAP |
| Data | SMS spam/scam messages, phishing URLs, PaySim transactions, plus our own Indian-context examples |
| Hosting | Free tiers (for example Render or Railway for the backend) |

## Repository structure

```
Drunix/
├── app/          # React Native (Expo) app
├── backend/      # FastAPI service and shared feature code
├── data/         # Data preparation scripts and processed files
│   ├── own/          # Our hand-written example messages
│   ├── processed/    # Train/test files used by the models
│   └── raw/          # Original downloads (NOT in Git)
├── models/       # Training code and saved models
└── docs/         # API contract and project scope
```

## Getting started

### Requirements

- Node.js (LTS), Git, Python 3.10 or newer
- Expo Go on your phone (Play Store or App Store)
- Your laptop and phone on the same Wi-Fi network

### Run the app

```
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go (on iPhone, use the Camera app). If your network blocks the connection, try `npx expo start --tunnel`.

### Set up the Python environment

```
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Run the backend

The backend is still being built. Instructions will be added here once it is ready.

## Data

Raw datasets are **not** stored in this repository because of their size and licenses. Each dataset has its own preparation script in `data/`, which cleans it and creates the train/test files in `data/processed/`.

| Dataset | Used for | Script |
|---|---|---|
| SMS spam/scam messages (plus our own examples) | Message check | `data/prepare_sms.py` |
| Phishing URLs | Link check | `data/prepare_urls.py` |
| PaySim synthetic transactions | Transaction check | `data/prepare_transactions.py` |

Sources, licenses, sizes and download dates are listed in [data/README.md](data/README.md).

All splits use the same fixed random seed and an 80/20 train/test ratio, so results are comparable across the team.

## API

Every scoring endpoint returns the same shape:

```json
{
  "risk_score": 87,
  "level": "high",
  "reasons": [
    { "code": "LOOKALIKE_DOMAIN", "text": "Link imitates a bank's website", "weight": 0.45 }
  ]
}
```

Endpoints: `/score/message`, `/score/payee`, `/score/transaction`, `/score/combined` and `/health`. Full details are in [docs/api-contract.md](docs/api-contract.md).

## Project status

- [x] Plan and scope agreed
- [x] API contract written
- [ ] Data collected and prepared
- [ ] Models trained
- [ ] Explanations and score fusion
- [ ] Backend API
- [ ] Mobile app connected to the backend
- [ ] Evaluation (precision, recall, false-positive rate)
- [ ] Deployment
- [ ] Demo and slides

## Evaluation

Results will be reported honestly on a held-out test set: precision, recall and false-positive rate, with a before-and-after comparison of the baseline and improved models. Known limitations will be listed here.

## Privacy

The app is designed so that messages are not stored. Only the score and reasons are returned.

## Team

- Name 1
- Name 2
- Name 3

## License

To be decided.
