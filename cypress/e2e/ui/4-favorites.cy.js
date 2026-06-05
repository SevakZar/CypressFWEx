/// <reference types="cypress" />

// Page objects
import MainPage from '../../support/page-objects/main-page'

// Configurations
const userKey = 'customer' //LoginUserAS
let selectedProduct

/**
 * Used cy.section() for distinguish between test stages
 * Used AAA syntax (Arrange/Act/Assert) + cy.step() for better logs and more clear test steps
 */

describe('Favorites Tests', { tags: ['@ui'] }, () => {
  beforeEach(() => {
    cy.section('Test Setup')
    cy.step('ARRANGE: Login user and visit home page')
    cy.loginAs(userKey)
    cy.visit('/') // {failOnStatusCode: false})  ?????
  })

  it('Add product to favorites (logged in) - Question 11', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')
    cy.step('ACT: Select a product')
    cy.get(MainPage.productCard).eq(0).click()

    cy.step('ACT: Select the product as Favorite')
    cy.get(MainPage.productInfo)
      .find(MainPage.productName)
      .invoke('text')
      .then(($selectedProduct) => {
        selectedProduct = $selectedProduct
        cy.get(MainPage.productInfo).find(MainPage.favoriteBtn).click()

        cy.step('ACT: Go to user Favorite products')
        cy.get(MainPage.userMenuButton).click()
        cy.get(MainPage.favoritesButton).click()

        cy.step('ASSERT: Product appears in the favorites list')
        cy.get(MainPage.favoriteGrid).should('contain', selectedProduct)
      })
  })

  after(() => {
    cy.step('ACT: Go to user Favorite products')
    cy.get(MainPage.userMenuButton).click()
    cy.get(MainPage.favoritesButton).click()

    cy.step('ASSERT: Delete Product appears in the favorites list')
    cy.contains(selectedProduct).parent().find('[data-testid="remove-favorite"]').click()
    cy.get('body').should('not.contain', selectedProduct)
  })
})
