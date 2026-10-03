# ERP AI Report

An ERP reporting dashboard that answers questions about business data with a **local LLM**
(Ollama). Everything runs in Docker on your own machine: the data never leaves the server,
no internet connection is needed once the model is downloaded, and there is no per-request cost.

> The interface, API field names and sample data are in Turkish.

## What it does

- **Ask in plain language** — type a question such as "Which city do we sell the most in?"
  and get an answer based on the current sales data
- **Predefined reports** — 9 reports across sales, customers, products and staff, shown as
  tables with a simple bar chart
- **AI commentary on any report** — the model summarises the result, lists the key findings
  and suggests next steps
- **Dashboard** — summary cards for sales, top products and staff
- **Status checks** — the UI shows whether the backend and the model are reachable

This is a demo project with a small sample database (customers, products, sales, staff). It
is meant to show the approach, not to be a production ERP.

## How it works

```
Browser (HTML / CSS / vanilla JS)
        │  fetch
        ▼
Express API ──► PostgreSQL   (fixed, parameterised queries)
        │
        └────► Ollama        (llama3.2, running locally)
```

The model never writes SQL. The backend runs a fixed set of queries, passes the results to
the model as context and asks it to answer or summarise. This keeps the database safe from
generated queries, at the cost of only answering questions the predefined data can cover.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS, vanilla JavaScript (single page, no build step) |
| Backend | Node.js, Express |
| Database | PostgreSQL 16 |
| Local AI | Ollama, llama3.2 |
| Runtime | Docker Compose |

## Getting started

Requirements: [Docker Desktop](https://www.docker.com/products/docker-desktop) and Git.

```bash
git clone https://github.com/dilanhosgoren/erp-ai-rapor.git
cd erp-ai-rapor
docker compose up --build
```

In a second terminal, download the model (first run only):

```bash
docker exec -it erp-ollama ollama pull llama3.2
```

Then open <http://localhost:3000>.

The database credentials in `docker-compose.yml` and `.env.example` are local development
defaults. Change them before exposing the stack to a network.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/raporlar` | List the predefined reports |
| GET | `/api/raporlar/:kod` | Run a report, e.g. `R001` |
| GET | `/api/raporlar/fonksiyonlar` | List the ERP functions |
| GET | `/api/raporlar/erp/:kod` | Run an ERP function, e.g. `F001` |
| POST | `/api/ai/sor` | Ask a free-form question (`{ "soru": "..." }`) |
| POST | `/api/ai/analiz` | Ask the model to analyse a table (`{ "tablo": "satislar" }`) |
| GET | `/api/ai/durum` | Model status |
| GET | `/health` | Backend health check |

## Using an Ollama server on another machine

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2
```

Then set `OLLAMA_URL=http://SERVER_IP:11434` in the `backend` service environment in
`docker-compose.yml`.

## License

[MIT](LICENSE)
