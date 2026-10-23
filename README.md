# FarmSaathi AI

FarmSaathi AI is a responsive agricultural assistant designed for Indian farmers. It brings together a farming dashboard, AI guidance, crop health analysis, weather and field alerts, searchable knowledge guides, and saved reports.

## Local setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm

### Frontend

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

The app runs at http://localhost:5173.

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs are available at http://localhost:8000/docs.

## Demo mode

The app works fully in demo mode without AWS credentials. Demo responses are clearly labeled and should be treated as local guidance only.

## AWS configuration

Set real AWS and weather credentials in the backend .env file. Bedrock access requires a configured IAM identity and model access in the selected AWS Region.

## Project structure

- frontend - Vite + React + TypeScript app
- backend - FastAPI API with demo providers and local report persistence
- infrastructure - optional AWS deployment resources

## Hackathon notes

- This project intentionally keeps the web app and API separate.
- No secrets are stored in Vite frontend env files.
- Real AWS integrations are disabled until the environment is configured and the required permissions are granted.
