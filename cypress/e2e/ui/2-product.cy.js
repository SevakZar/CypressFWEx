/// <reference types="cypress" />

// Page objects
import MainPage from '../../support/page-objects/main-page'
import { getDollarAmount } from '../../support/utils'

// Configurations
const userKey = 'customer' //LoginUserAS

/**
 * Used cy.section() for distinguish between test stages
 * Used AAA syntax (Arrange/Act/Assert) + cy.step() for better logs and more clear test steps
 */

describe('Product Tests', { tags: ['@ui'] }, () => {
  beforeEach(() => {
    cy.section('Test Setup')
    cy.step('ARRANGE: Without Login user, visit home page')
    // cy.loginAs(userKey)
    cy.visit('/')
  })

  it('Display products on home page - Question 4', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')
    cy.step('ASSERT: Product should be visible')
    cy.get(MainPage.productCard)
      .should('have.length.at.least', 9)
      .each(($card) => {
        cy.step('ASSERT: product Name should be visible')
        cy.wrap($card).find(MainPage.productName).should('be.visible').and('not.be.empty')
        cy.step('ASSERT: product Price should be visible')
        cy.wrap($card).find(MainPage.itemPrice).should('be.visible').and('not.be.empty')
      })
  })

  it('Product search with valid keyword - Question 5', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')
    cy.step('ACT: Enter hammer in search box')
    cy.get(MainPage.searchQuery).click().type('hammer') //shorter version: .type("hammer{enter}")
    cy.get(MainPage.searchButton).click()
    cy.get(MainPage.productCard)
      .should('have.length.at.least', 1)
      .each(($card) => {
        cy.step('ASSERT: product Name should contain hammer')
        cy.wrap($card)
          .find(MainPage.productName)
          .should(($name) => {
            expect($name.text().toLowerCase()).to.contain('hammer')
            //expect($el.text()).to.match(/drill/i) // which one is better?????
          })
      })
  })

  it('Filter products by category - Question 6', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')
    cy.step('ACT: Select Drills (or Power Tools) from the category filter')
    cy.get(MainPage.filterCategoryPowerTools).click()
    cy.get(MainPage.productCard)
      .should('have.length.at.least', 1)
      .each(($category) => {
        cy.step('ASSERT: Only drill/power tool products are displayed')
        cy.wrap($category)
          .find(MainPage.productCategory)
          //.should('have.text', 'DRILLS')
          .invoke('text')
          .then((text) => {
            expect(text.trim()).to.be.oneOf(['Drills', 'Grinders', 'Saws', 'Sanders'])
          })
      })
  })

  it('Sort products by price (Low to High) - Question 7', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')
    cy.intercept('GET', '/api/products?_sort=price&_order=asc&_page=1&_limit=9').as('priceSort') //the response time for fetch the data and sort has delay (config a)
    cy.step('ACT: Select Price (Low - High) from sort dropdown')
    cy.get(MainPage.sortSelection).select('Price Low-High')
    cy.wait('@priceSort').its('response.statusCode').should('be.oneOf', [200, 304]) //the response time for fetch the data and sort has delay (then config b)

    cy.step('ASSERT: Products are sorted with lowest price first (e.g. Retractable Tape Measure 8m at $8.99 near the top)')
    cy.get(MainPage.itemPrice)
      .should('have.length.at.least', 1)
      .then(($prices) => {
        const actualPrices = [...$prices].map((el) => getDollarAmount(Cypress.$(el)))
        const expectedPrices = [...actualPrices].sort((a, b) => a - b)
        expect(actualPrices).to.deep.equal(expectedPrices)
      })
    cy.get(MainPage.productCard).first().should('contain', 'Utility Knife with 10 Blades').and('contain', '$7.99')
  })
})
