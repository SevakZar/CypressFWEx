/// <reference types="cypress" />

// Page objects
import ContactForm from '../../support/page-objects/contact-form'

// Configurations
const userKey = 'customer' //LoginUserAS

/**
 * Used cy.section() for distinguish between test stages
 * Used AAA syntax (Arrange/Act/Assert) + cy.step() for better logs and more clear test steps
 */

describe('Contact Form Tests', { tags: ['@ui'] }, () => {
  beforeEach(() => {
    cy.section('Test Setup')
    cy.step("ARRANGE: Don't Login user and visit home page")
    //cy.loginAs(userKey)
    cy.visit('/') 
  })

  it('Submit contact form as guest - Question 12', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')
    cy.step('ACT: Navigate to /contact')
    cy.get('[class="space-y-2 text-sm"] > li > [href="/contact"]').click()

    cy.step('ACT: Fill the fields')
    cy.get(ContactForm.contactName).type('Brad Pitt')
    cy.get(ContactForm.contactEmail).type('Brad_Pitt@gmail.com')
    cy.get(ContactForm.contactSubject).type('Dont have any dropdown')
    cy.get(ContactForm.contactMessage).type('Test For Minimum 50 characters ++++++++++++++++++')

    cy.step('ACT: Submit the feedback')
    cy.get(ContactForm.contactSubmit).click()

    cy.step('ASSERT: Form submitted successfully, confirmation message displayed')
    cy.get(ContactForm.contactSuccessTitle).should('be.visible').and('have.text', 'Message Sent!')
  })
})
