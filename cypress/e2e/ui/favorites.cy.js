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

describe('Favorites Tests', { tags: ['@ui'] }, () => {
    beforeEach(() => {
        cy.section("Test Setup")
        cy.step("ARRANGE: Login user and visit home page")
        cy.loginAs(userKey)
        cy.visit('/') // {failOnStatusCode: false})  ?????
    })

    it('Add product to favorites (logged in) - Question 11', { tags: ['@smoke', '@regression'] }, () => {
        cy.section("Test Body")
        cy.step("ACT: Select a product")
        cy.get('[data-testid="product-card"]').eq(0).click()

        cy.step("ACT: Select the product as Favorite")
        cy.get('[data-id="product-info"]').find('[data-testid="product-name"]').invoke('text').then(($selectedProduct) => {
            const selectedProduct = $selectedProduct;
            cy.get('[data-id="product-info"]').find('[data-testid="favorite-btn"]').click()

            cy.step("ACT: Go to user Favorite products")
            cy.get(MainPage.userMenuButton).click()
            cy.get(MainPage.favoritesButton).click()

            cy.step("ASSERT: Go to user Favorite products")
            cy.get('[data-testid="favorites-grid"]').should('contain', selectedProduct)
        })
    })
})