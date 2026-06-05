/// <reference types="cypress" />

// Page objects
import MyProfile from '../../support/page-objects/my-profile'

// Configurations
const userKey = 'customer' //LoginUserAS

/**
 * Used cy.section() for distinguish between test stages
 * Used AAA syntax (Arrange/Act/Assert) + cy.step() for better logs and more clear test steps
 */

describe('User Account Tests', { tags: ['@ui'] }, () => {
  beforeEach(() => {
    cy.section('Test Setup')
    cy.step('ARRANGE: Login user and visit home page')
    cy.loginAs(userKey)
    cy.step('ACT: Navigate to /account/profile')
    cy.visit('/account/profile')
  })

  it('View user profile - Question 13', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')
    cy.step('ASSERT: User details are displayed (name, email, phone, address, DOB)')
    cy.step('ASSERT: first-name')
    cy.get(MyProfile.firstname).should('be.visible').and('not.have.value', '')
    cy.step('ASSERT: last-name')
    cy.get(MyProfile.lastname).should('be.visible').and('not.have.value', '')
    cy.step('ASSERT: email')
    cy.get(MyProfile.email).should('be.visible').and('not.have.value', '')
    cy.step('ASSERT: phone')
    cy.get(MyProfile.phone).should('be.visible').and('not.have.value', '')
    cy.step('ASSERT: Adress(street)')
    cy.get(MyProfile.street).should('be.visible').and('not.have.value', '')
    cy.step('ASSERT: Date of Birth')
    cy.get(MyProfile.dob).should('be.visible').and('not.have.value', '')
  })
})
