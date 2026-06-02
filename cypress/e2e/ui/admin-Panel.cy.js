/// <reference types="cypress" />

// Page objects
import LoginPage from "../../support/page-objects/login-page"
import MainPage from "../../support/page-objects/main-page"
import CartPage from "../../support/page-objects/cart-page"
import CheckoutPage from "../../support/page-objects/checkout-page"

// Configurations
const userKey = 'admin' //LoginUserAS
const newBrand = 'Question 14 Brand'

/**
 * Used cy.section() for distinguish between test stages
 * Used AAA syntax (Arrange/Act/Assert) + cy.step() for better logs and more clear test steps
 */

describe('Admin Panel Tests', { tags: ['@ui'] }, () => {
    beforeEach(() => {
        cy.section("Test Setup")
        cy.step("ARRANGE: Login user and visit home page")
        cy.loginAs(userKey)
    })

    it('Add new brand - Question 14', { tags: ['@smoke', '@regression'] }, () => {

        cy.section("Test Body")
        cy.step("ACT: Navigate to /admin/brands")
        cy.visit('/admin/brands')
        cy.step("ACT: Click Add Brand")
        cy.get('[data-testid="add-brand"]').click()
        cy.step("ACT: Fill brand name")
        cy.get('[data-testid="brand-name"]').type(newBrand)
        cy.step("ACT: As the for loading was a little bit slow")

        cy.intercept('POST', '/api/brands').as('brandsSave')
        cy.step("ACT: Save")
        cy.get('[data-testid="submit-brand"]').click()
        cy.wait('@brandsSave').its('response.statusCode').should('eq', 201)

        cy.step("ASSERT: New brand is created and appears in the brands list")
        cy.get('[data-testid="brands-table"]>tbody>tr>td:first-child').should('contain', newBrand)

    })

    after(() => {
        cy.section("Test Rollback")
        cy.step("ACT: Navigate to /admin/brands")
        cy.visit('/admin/brands')

        cy.intercept('GET', '/api/brands').as('brands')
        cy.wait('@brands').its('response.statusCode').should('eq', 304)

        cy.step("ACT: Delete inserted Brand")
        cy.window().then((win) => {
            win.confirm = ((text) => {
                expect(text).to.contain('Delete this brand?')
                return true
            })
        })        
        cy.step("ACT: Find the inserted Brand")
        cy.contains(newBrand).parent().within(() => {
            cy.get('button').click()
        })

    })
})