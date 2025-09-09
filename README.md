# API Gateway Tests

Cypress tests for a Kong API Gateway instance. Runs locally with Docker Compose and in CI with GitHub Actions.

## Prerequisites
- Docker and Docker Compose
- Node.js 18+ only if you want to run Cypress outside Docker
- Git

## Setup
1. Clone the repository
   ```bash
   git clone https://github.com/anamicaarya/api-gateway-tests.git
   cd api-gateway-tests
   ```
2. Start Kong
   ```bash
   docker compose up -d
   ```
3. Open Kong Manager at `http://localhost:8002/`.
   The banner “No valid Kong Enterprise license configured” is expected for this exercise.

## Run tests

### With Docker (recommended)
```bash
docker compose -f docker-compose-cypress.yml up --no-build
```

You can narrow to a spec by setting `FOLDER`, for example:
```bash
FOLDER="cypress/e2e/**/services.cy.ts" docker compose -f docker-compose-cypress.yml up --no-build
```

**Cypress Cloud recording (optional):**
- Set an environment variable `CYPRESS_RECORD_KEY=<key>`.
- The workflow and compose setup record only when the key is present.

### Without Docker (local Node)
```bash
npm install
npx cypress open     # interactive
# or
npx cypress run      # headless
```

## Teardown
```bash
docker compose -f docker-compose-cypress.yml down -v || true
docker compose down -v || true
```

## Configuration
- `kong-manager.env` holds Kong UI related environment values.
- `spec-folder.env` can set `FOLDER` for spec selection.
- Reports are written to `cypress/reports`.

## Design choices
- Containerized runner for consistent local and CI execution.
- Simple, readable tests that cover the core flow: create Service, add Route, verify through the proxy.
- CI on pushes and pull requests for fast feedback.

## Assumptions
- Tests target the Kong instance from this compose stack.
- Published ports match the compose files.

## Future ideas
- Slack notifications from CI.
- Allure or Mochawesome HTML report published as an artifact.
