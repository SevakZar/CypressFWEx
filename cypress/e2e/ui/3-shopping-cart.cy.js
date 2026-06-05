/// <reference types="cypress" />

// Page objects
import MainPage from '../../support/page-objects/main-page'
import CartPage from '../../support/page-objects/cart-page'

// Configurations
const userKey = 'customer' //LoginUserAS

/**
 * Used cy.section() for distinguish between test stages
 * Used AAA syntax (Arrange/Act/Assert) + cy.step() for better logs and more clear test steps
 */

describe('Shopping cart Tests', { tags: ['@ui'] }, () => {
  beforeEach(() => {
    cy.section('Test Setup')
    cy.step('ARRANGE: Without Login user, visit home page')
    // cy.loginAs(userKey)
    cy.visit('/') // {failOnStatusCode: false})  ?????
  })

  it('Add product to cart as guest - Question 8', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')
    cy.step('ACT: Click on a product (e.g. Claw Hammer 16oz)')
    cy.get(MainPage.searchQuery).click().type('Claw Hammer 16oz{enter}')
    cy.get(MainPage.searchButton).click()
    cy.get(MainPage.productCard)
      .should('have.length.at.least', 1)
      .each(($card) => {
        cy.step('ASSERT: product Name must be Claw Hammer 16oz')
        cy.wrap($card)
          .find(MainPage.productName)
          .should(($name) => {
            expect($name.text().toLowerCase()).to.contain('claw hammer 16oz')
          })
        cy.step('ACT: Click Add to Cart')
        cy.get(CartPage.addToCartBtn).click()

        cy.step('ASSERT: Cart badge updates to show quantity 1, success toast displayed')
        cy.get(CartPage.cartCount).should('be.visible').and('have.text', 1)
      })
  })

  it('Update quantity in cart - Question 9', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')

    cy.step('ACT: Add a product to cart')
    cy.section('Test Body')
    cy.step('ACT: Click on a product (e.g. Claw Hammer 16oz)')
    cy.get(MainPage.searchQuery).click().type('Claw Hammer 16oz{enter}')
    cy.get(MainPage.searchButton).click()
    cy.step('ACT: Click Add to Cart')
    cy.get(CartPage.addToCartBtn).click()
    cy.get(CartPage.cartCount).should('be.visible').and('have.text', 1)

    cy.step('ACT: Navigate to /checkout')
    cy.get(MainPage.cartButton).click()

    //const price = cy.get(CartPage.cartItemTotal).invoke('text')
    cy.get(CartPage.cartItemTotal)
      .invoke('text')
      .then((text) => {
        const expectedPrice = Number(text.replace('$', '').trim()) * 3

        cy.step('ACT: Increase quantity to 3')
        Cypress._.times(2, () => {
          cy.get(CartPage.cartQtyIncrease).click()
        })

        cy.step('ASSERT: Quantity updated to 3, total price recalculated correctly')
        cy.get(CartPage.cartQuantity).should('have.text', 3)
        cy.get(CartPage.cartItemTotal)
          .invoke('text')
          .then((text) => {
            const actualPrice = Number(text.replace('$', '').trim())
            expect(actualPrice).to.equal(expectedPrice)
          })
      })
  })

  it('Remove product from cart - Question 10', { tags: ['@smoke', '@regression'] }, () => {
    cy.section('Test Body')

    cy.step('ACT: Add a product to cart')
    cy.section('Test Body')
    cy.step('ACT: Click on a product (e.g. Claw Hammer 16oz)')
    cy.get(MainPage.searchQuery).click().type('Claw Hammer 16oz{enter}')
    cy.get(MainPage.searchButton).click()
    cy.step('ACT: Click Add to Cart')
    cy.get(CartPage.addToCartBtn).click()
    cy.get(CartPage.cartCount).should('be.visible').and('have.text', 1)

    cy.step('ACT: Navigate to /checkout')
    cy.get(MainPage.cartButton).click()

    cy.step('ACT: Click remove (×) button')
    cy.contains('Claw Hammer 16oz').parents(CartPage.cartItem).find(CartPage.cartRemove).click()

    cy.step('ASSERT: Product is removed from cart, cart becomes empty or badge decrements')
    cy.get(CartPage.cartEmpty).should('contain', 'Your cart is empty')
    cy.get('body').should('not.contain', 'Claw Hammer 16oz')
  })
})
