# API Gateway Tests for Kong

A practical Cypress test suite for validating a local Kong API Gateway instance. It mirrors your repository layout on the `feature/scope_v1` branch and is ready for both local runs and GitHub Actions.

> Audience. A QA or SDET reviewer who wants a clean setup, a minimal but representative set of tests, and clear reasoning behind the choices.

---

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18 or newer (only required if you run Cypress outside Docker)
- Git

### Clone and start Kong
```bash
git clone https://github.com/anamicaarya/api-gateway-tests.git
cd api-gateway-tests

# Start Kong stack (Kong, DB, Manager) in the background
docker compose up -d
```

Open Kong Manager at `http://localhost:8002/`. The banner that says “No valid Kong Enterprise license configured” is expected for this exercise.

### Run tests with Docker (recommended)
This uses the project’s Cypress runner container.

```bash
docker compose -f docker-compose-cypress.yml up --no-build
```

To target a specific spec, set the `FOLDER` variable:
```bash
FOLDER="cypress/e2e/**/services.cy.ts" docker compose -f docker-compose-cypress.yml up --no-build
```

### Run tests without Docker
```bash
npm install
npx cypress open     # interactive
# or
npx cypress run      # headless
```

### Teardown
```bash
docker compose -f docker-compose-cypress.yml down -v || true
docker compose down -v || true
```

Artifacts are written under `cypress/reports`. Videos and screenshots are under `cypress/videos` and `cypress/screenshots`.

---

## Repository Map

```
.
├─ .github/workflows/             # GitHub Actions workflow for headless runs
├─ cypress/
│  ├─ e2e/                        # Specs for Services, Routes, and plugin checks
│  ├─ fixtures/                   # Seed data for repeatable runs
│  ├─ support/                    # Custom commands and test hooks
│  └─ reports/                    # HTML reports
├─ cypress.config.js              # Cypress configuration
├─ docker-compose.yml             # Kong, DB, Kong Manager
├─ docker-compose-cypress.yml     # Cypress runner
├─ Dockerfile                     # Base image for the project, if needed
├─ kong-manager.env               # UI related variables
├─ spec-folder.env                # Optional spec selection, sets FOLDER
└─ package.json
```

---

## What the suite covers

1. **Kong Manager flows**
   - Create a Service through the UI.
   - Create a Route associated with that Service.
   - Basic list and detail validation.
2. **Proxy checks**
   - Verify that configured paths and methods respond.
   - Verify that unknown paths return the expected failure code.
3. **Plugin sanity example**
   - A focused example such as key-auth to illustrate enablement, expected denial without credentials, and success with the correct header.

This is a compact but realistic slice that you can extend in small steps.

---

## Configuration

- `kong-manager.env` holds Kong UI related environment values.
- `spec-folder.env` sets `FOLDER` when you want to narrow execution to a subset of specs.
- Common variables used by the suite:
  ```
  KONG_MANAGER_URL=http://localhost:8002
  KONG_ADMIN_URL=http://localhost:8001
  KONG_PROXY_URL=http://localhost:8000
  WORKSPACE=default
  ```

---

## Design considerations

### 1. Local first, CI aligned
Use Docker Compose so local runs match CI. A single command boots Kong, Postgres, and Kong Manager with the same defaults that CI expects.

**Trade off.** Compose startup adds time compared to mocks. The benefit is confidence in real behavior.

### 2. UI to seed, HTTP to verify
Create entities via the UI so the flow is true end to end. Verify behavior through the proxy because HTTP checks are fast and robust.

**Trade off.** UI is slower and can be flaky. Stable `data-testid` selectors and network intercepts reduce flakiness.

### 3. Deterministic selectors and waits
Prefer `data-testid` selectors. Use `cy.intercept` plus `cy.wait` on named aliases for readiness. Avoid blind sleeps, except when eventual consistency is unavoidable.

**Trade off.** Adding test identifiers takes a little more effort but prevents long term breakage.

### 4. Minimal but meaningful plugin coverage
Start with a single plugin example that shows the pattern clearly. Copy the pattern for rate limiting, JWT, or OIDC later.

**Trade off.** Breadth is limited. Depth is clear, which keeps review time low and signals how to extend.

### 5. Build from Dockerfile only when control is needed
The repository can run against official images or build from a Dockerfile. Building an image gives you control to add reporters and tools once, then keep runs consistent in local and CI.

**Trade off.** Building the image costs minutes. You gain predictable tooling and no ad hoc installs.

---

## Assumptions

- You are testing the Kong instance that the provided compose files boot on `localhost` ports.
- The default workspace is used. If you use multiple workspaces, pass the name through `WORKSPACE`.
- External plugin dependencies are either reachable or disabled for the exercise.
- The UI provides stable `data-testid` hooks for elements that tests interact with.

---

## Execution details and tips

### Typical flow
1. Create a Service in Kong Manager. Save, confirm it appears in the list.
2. Create a Route from the Service detail. Save, confirm it appears in the list.
3. Hit the proxy path through `http://localhost:8000` to verify success and expected failures.
4. Add a plugin on the Service or Route. Validate denial and acceptance paths.

### Common issues

- **Two matching elements on click.** Click only visible elements:
  ```js
  cy.get('[data-testid="action-entity-edit"]').filter(':visible').click()
  ```

- **Cross origin script errors in Cypress.** Use the `crossorigin` attribute and ensure CORS headers, or serve the app under a single origin in test mode.

- **Chrome DBus warnings in containers.** These are harmless in minimal containers. Add `--no-sandbox` if your environment requires it.

- **Artifacts missing in CI.** Ensure reporter output paths match what the workflow uploads. Verify `cypress/reports` exists after the run.

---

## Trade offs summary

- UI flows increase realism and cost time. Balance with API seeded smoke tests when speed matters.
- Compose is slower than mocks. It buys you reproducibility and parity with CI.
- Deterministic selectors take setup effort. They pay back by eliminating flaky tests.
- Building a custom runner image takes minutes. It guarantees consistent tools and reporting.

---

## Future improvements

- Slack notifications on failure and on summary.
- Allure or Mochawesome HTML report published in Actions artifacts.
- Admin API driven seeding for a faster smoke tier while keeping UI flows for full E2E.