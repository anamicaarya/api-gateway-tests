# API Gateway Tests

## Overview  
This repository contains an automated test suite for validating the functionality of a **Kong API Gateway** instance. The suite is built using **Cypress**, containerized with **Docker Compose**, and integrated with **GitHub Actions** for CI execution.  

The objective is to demonstrate not just test automation, but a **QA-driven approach** to design, maintainability, and feedback loops.

---

## Local Setup & Execution

### Prerequisites  
- Docker and Docker Compose  
- Node.js 18+ (if running Cypress outside of Docker)  
- Git  

### Steps  

1. Clone the repository  
   ```bash
   git clone https://github.com/anamicaarya/api-gateway-tests.git
   cd api-gateway-tests
   ```

2. Configure environment  
   - `kong-manager.env` – Kong Manager configuration  
   - `spec-folder.env` – Cypress environment variables  

3. Start services  
   ```bash
   docker-compose up --build
   ```

4. Run tests  
   With Browser  
   ```bash
   npm install
   npx cypress open
        or
   npx cypress open --e2e --browser electron     
   ```
   
   Headless
   ```bash
   npm install
   npx cypress run 
   ```
   
   With docker-compose
   ```bash
   docker compose -f docker-compose-cypress.yml up
   ```

5. Tear down  
   ```bash
   docker-compose down
   ```

---

## Design Considerations  

- **Containerization** for consistent environments across local and CI runs.  
- **Readable tests** with fixtures and descriptive assertions to support collaboration.  
- **CI integration** via GitHub Actions to ensure feedback is available on every commit.  
- **Configuration isolation** using `.env` files so test logic is not tied to a single environment.  

---

## Assumptions  

- Tests run against the Kong instance provisioned here (not external production).  
- Docker Compose provides the expected services and ports.

---

## Trade-Offs  
  
- **Functional over performance**: This suite validates correctness, not throughput or scalability.  
- **Simplified error handling**: Kept lean to focus on demonstrating core test logic.  

---

## QA Principles in Practice  

- **Shift-Left Testing**  
  By containerizing the test runner, developers and QAs can run the exact same suite locally before merging. This prevents late discovery of issues in staging.  

- **Fast Feedback Loops**  
  GitHub Actions run these tests on pull requests, giving teams confidence in routing, proxy, and configuration changes within minutes. Cypress video and screenshot artifacts speed up debugging.  

- **Risk-Based Testing**  
  Tests target the **highest-value scenarios**: service creation, route addition, and request validation. These are critical paths in API gateway usage, while less risky features (like advanced plugins) were deprioritized for the exercise.  

- **Maintainability**  
  By externalizing configuration into `.env` files, the suite can adapt to different environments (local, CI, staging) without rewriting tests. The structure encourages growth into a larger framework.  

- **Collaboration**  
  Cypress syntax and reports are accessible to developers, product owners, and QA. This aligns with my philosophy that tests should be a **shared asset**, not siloed scripts.  

---

## Future Enhancements  

- Enhance CI workflow with Slack notifications**.  

---

## Why This Approach  

My focus in building this assessment was to show **how I approach QA automation in a real engineering context**:  
- Establish reproducible environments to reduce test flakiness.  
- Prioritize tests that deliver the highest risk coverage with minimal overhead.  
- Integrate testing tightly with CI/CD pipelines so quality is measured continuously.  
- Keep the suite extensible so it can evolve with the system.  
