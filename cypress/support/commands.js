// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import LoginPage from "./page-objects/login-page"
import MainPage from "./page-objects/main-page"

Cypress.Commands.add('login', (email, password) => {
    cy.session(
        [email, password],
        () => {
            cy.visit('/auth/login')
            cy.get(LoginPage.usernameInput).type(email)
            cy.get(LoginPage.passwordInput).type(password)
            cy.get(LoginPage.loginButton).click()
            cy.get(MainPage.cartButton).should('be.visible')
        }
    )
})

Cypress.Commands.add('loginAs', (userKey) => {
    const users = Cypress.env('users') // fetch all users from cypress.env.json
    const user = users[userKey] // pick the user by key (like 'customer', 'admin')
    if (!user) {
        throw new Error(`User "${userKey}" not found in cypress.env.json`)
    }
    cy.login(user.email, user.password)
})

// cy.visit('/')
// cy.get('body').then(($body) => {
//     if ($body.find(MainPage.cartButton).length === 0) {
//         cy.get(LoginPage.usernameInput).should('be.visible').type(username)
//         cy.get(LoginPage.passwordInput).type(password)
//         cy.get(LoginPage.loginButton).click()
//     }
// })
// cy.get(MainPage.cartButton, { timeout: 10000 }).should('be.visible')
