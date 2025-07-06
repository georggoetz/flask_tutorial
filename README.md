# Getting started

* ```python3 -m venv .venv```
* ```source .venv/bin/activate```
* ```pip install .```
* ```flask --app flaskr init-db```
* ```flask --app flaskr run```

## Deployment auf Fly.io (mit Postgres und GitHub Actions)

### 1. Fly.io CLI installieren

```bash
curl -L https://fly.io/install.sh | sh
```

### 2. App auf Fly.io anlegen

```bash
fly launch --no-deploy
```
- App-Name wählen (z.B. `flask-tutorial`)
- Region wählen (z.B. `fra` für Frankfurt)
- Dadurch wird auch eine `fly.toml` erstellt

### 3. Postgres-Datenbank auf Fly.io anlegen

```bash
fly postgres create --name flask-tutorial-db --region fra --initial-cluster-size 1
```
- Verbindungsdaten notieren

**Datenbank mit App verbinden:**
```bash
fly postgres attach --app flask-tutorial flask-tutorial-db
```
- Dadurch wird automatisch ein `DATABASE_URL`-Secret gesetzt

### 4. Secrets setzen (z.B. SECRET_KEY)

```bash
fly secrets set SECRET_KEY=$(openssl rand -hex 32)
```
- Weitere Secrets nach Bedarf

### 5. Dockerfile und fly.toml prüfen
- Dockerfile: Gunicorn lauscht auf Port 5000
- fly.toml: `internal_port = 5000`, App-Name stimmt

### 6. GitHub Actions einrichten
- Workflow unter `.github/workflows/deploy.yml` anlegen (siehe Projekt)
- Fly.io-API-Token als Secret im GitHub-Repo anlegen: `FLY_API_TOKEN`

### 7. Erster Deploy
- Lokal:
  ```bash
  fly deploy
  ```
- Oder per GitHub Actions: Push auf den Branch, der den Workflow triggert (`main` oder `master`)

### 8. Datenbank initialisieren und seeden
- Nach dem ersten Deploy:
  ```bash
  fly ssh console -a flask-tutorial
  flask init-db
  flask seed-db
  exit
  ```
  
  **Wichtig: SSL für Postgres aktivieren**
  
  Fly.io-Datenbanken verlangen eine SSL-gesicherte Verbindung. Stelle sicher, dass deine `DATABASE_URL` folgendes enthält:
  
  ```
  postgres://...:...@.../...?sslmode=require
  ```
  
  Falls du die Fehlermeldung `sslmode=disable is not supported` oder ähnliche SSL-Fehler erhältst, prüfe, ob in deiner Fly.io-Umgebung die Umgebungsvariable `DATABASE_URL` korrekt gesetzt ist (meist automatisch durch `fly postgres attach`).
  
  **Tipp:**
  - In der Dockerfile werden `ca-certificates` installiert, damit SSL funktioniert.
  - In der lokalen Entwicklung kannst du weiterhin SQLite nutzen (siehe Fallback in `flaskr/__init__.py`).
  - Für Tests wird automatisch SQLite verwendet.

### 9. App im Browser aufrufen
- Die URL findest du im Fly.io-Dashboard oder nach dem Deploy im Terminal.

### Beispiel: fly.toml für Flask auf Fly.io

```toml
app = 'flask-tutorial'
primary_region = 'fra'

[build]

[http_service]
internal_port = 5000
force_https = true
auto_stop_machines = 'stop'
auto_start_machines = true
min_machines_running = 0
processes = ['app']

[[vm]]
memory = '1gb'
cpu_kind = 'shared'
cpus = 1

[deploy]
regions = ['fra']
```

### Wichtiger Hinweis: SSL für Postgres in Produktion
- Das Docker-Image installiert jetzt automatisch `ca-certificates` für sichere SSL-Verbindungen zu Postgres.
- Setze deine `DATABASE_URL` auf Fly.io IMMER mit `?sslmode=require` (z.B. `postgresql://...:5432/dbname?sslmode=require`).
- Beispiel:
  ```bash
  fly secrets set DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
  ```
- Für die meisten Fly.io-Postgres-Instanzen reicht das System-CA-Bundle, kein eigenes Zertifikat nötig.
- Bei Problemen mit SSL: Stelle sicher, dass das Paket `ca-certificates` im Image installiert ist (siehe Dockerfile) und dass die Datenbank SSL unterstützt.

---

**Zusammengefasst:**
- App und DB auf Fly.io anlegen
- Secrets setzen
- Dockerfile und fly.toml korrekt konfigurieren
- GitHub Actions für automatisches Deployment einrichten
- Nach dem Deploy DB initialisieren und seeden