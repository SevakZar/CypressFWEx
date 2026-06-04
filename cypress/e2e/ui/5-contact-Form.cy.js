/// <reference types="cypress" />

// Page objects
import LoginPage from "../../support/page-objects/login-page"
import MainPage from "../../support/page-objects/main-page"
import CartPage from "../../support/page-objects/cart-page"
import CheckoutPage from "../../support/page-objects/checkout-page"

// Configurations
const userKey = 'customer' //LoginUserAS

/**
 * Used cy.section() for distinguish between test stages
 * Used AAA syntax (Arrange/Act/Assert) + cy.step() for better logs and more clear test steps
 */

describe('Contact Form Tests', { tags: ['@ui'] }, () => {
    beforeEach(() => {
        cy.section("Test Setup")
        cy.step("ARRANGE: Don't Login user and visit home page")
        //cy.loginAs(userKey)
        cy.visit('/') // {failOnStatusCode: false})  ?????
    })

    it('Submit contact form as guest - Question 12', { tags: ['@smoke', '@regression'] }, () => {
        cy.section("Test Body")
        cy.step("ACT: Navigate to /contact")
        cy.get('[class="space-y-2 text-sm"] > li > [href="/contact"]').click()

        cy.step("ACT: Fill the fields")
        cy.get('[data-testid="contact-name"]').type('Brad Pitt')
        cy.get('[data-testid="contact-email"]').type('Brad_Pitt@gmail.com')
        cy.get('[data-testid="contact-subject"]').type('Dont have any dropdown')
        cy.get('[data-testid="contact-message"]').type('Test For Minimum 50 characters ++++++++++++++++++')

        cy.step("ACT: Submit the feedback")
        cy.get('[data-testid="contact-submit"]').click()

        cy.step("ASSERT: Form submitted successfully, confirmation message displayed")
        cy.get('[data-id="contact-success-title"]').should('be.visible').and('have.text','Message Sent!')

    })
    
})