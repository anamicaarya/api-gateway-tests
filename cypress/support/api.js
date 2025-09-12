export function adminGet(path) {
  return cy.request({ url: `${Cypress.env("kong_admin_url")}${path}`, failOnStatusCode: false });
}
export function adminPost(path, body) {
  return cy.request("POST", `${Cypress.env("kong_admin_url")}${path}`, body);
}
export function adminPatch(path, body) {
  return cy.request("PATCH", `${Cypress.env("kong_admin_url")}${path}`, body);
}
export function adminDelete(path) {
  return cy.request("DELETE", `${Cypress.env("kong_admin_url")}${path}`);
}
