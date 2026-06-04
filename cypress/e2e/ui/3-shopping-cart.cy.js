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

describe('Shopping cart Tests', { tags: ['@ui'] }, () => {

    beforeEach(() => {
        cy.section("Test Setup")
        cy.step("ARRANGE: Without Login user, visit home page")
        // cy.loginAs(userKey)
        cy.visit('/') // {failOnStatusCode: false})  ?????
    })


    it('Add product to cart as guest - Question 8', { tags: ['@smoke', '@regression'] }, () => {
        cy.section("Test Body")
        cy.step("ACT: Click on a product (e.g. Claw Hammer 16oz)")
        cy.get(MainPage.searchQuery).click().type("Claw Hammer 16oz{enter}")
        cy.get(MainPage.searchButton).click()
        cy.get(MainPage.productCard).should('have.length.at.least', 1)
            .each(($card) => {
                cy.step("ASSERT: product Name must be Claw Hammer 16oz")
                cy.wrap($card)
                    .find(MainPage.productName)
                    .should(($name) => {
                        expect($name.text().toLowerCase()).to.contain('claw hammer 16oz')
                    })
                cy.step("ACT: Click Add to Cart")
                cy.get('[data-testid="add-to-cart-btn"]').click()

                cy.step("ASSERT: Cart badge updates to show quantity 1, success toast displayed")
                cy.get('[data-id="cart-count"').should('be.visible').and('have.text', 1)
            })
    })

    it('Update quantity in cart - Question 9', { tags: ['@smoke', '@regression'] }, () => {
        cy.section("Test Body")

        cy.step("ACT: Add a product to cart")
        cy.section("Test Body")
        cy.step("ACT: Click on a product (e.g. Claw Hammer 16oz)")
        cy.get(MainPage.searchQuery).click().type("Claw Hammer 16oz{enter}")
        cy.get(MainPage.searchButton).click()
        cy.step("ACT: Click Add to Cart")
        cy.get('[data-testid="add-to-cart-btn"]').click()
        cy.get('[data-id="cart-count"').should('be.visible').and('have.text', 1)

        cy.step("ACT: Navigate to /checkout")
        cy.get(MainPage.cartButton).click()

        const price = cy.get('[data-id="cart-item-total"]').invoke('text')
        cy.get('[data-id="cart-item-total"]')
            .invoke('text')
            .then((text) => {
                const expectedPrice = Number(text.replace('$', '').trim()) * 3;

                cy.step("ACT: Increase quantity to 3")
                Cypress._.times(2, () => {
                    cy.get('[data-testid="cart-qty-increase"]').click()
                })

                cy.step("ASSERT: Quantity updated to 3, total price recalculated correctly")
                cy.get('[data-testid="cart-quantity"]').should('have.text', 3)
                cy.get('[data-id="cart-item-total"]')
                    .invoke('text')
                    .then((text) => {
                        const actualPrice = Number(text.replace('$', '').trim());
                        expect(actualPrice).to.equal(expectedPrice);
                    });
            });
    })

    it('Remove product from cart - Question 10', { tags: ['@smoke', '@regression'] }, () => {
        cy.section("Test Body")

        cy.step("ACT: Add a product to cart")
        cy.section("Test Body")
        cy.step("ACT: Click on a product (e.g. Claw Hammer 16oz)")
        cy.get(MainPage.searchQuery).click().type("Claw Hammer 16oz{enter}")
        cy.get(MainPage.searchButton).click()
        cy.step("ACT: Click Add to Cart")
        cy.get('[data-testid="add-to-cart-btn"]').click()
        cy.get('[data-id="cart-count"').should('be.visible').and('have.text', 1)

        cy.step("ACT: Navigate to /checkout")
        cy.get(MainPage.cartButton).click()

        cy.step("ACT: Click remove (×) button")
        cy.contains('Claw Hammer 16oz')
            .parents('[data-testid="cart-item"]')
            .find('[data-testid="cart-remove"]').click()

        cy.step("ASSERT: Product is removed from cart, cart becomes empty or badge decrements")
        cy.get('[data-id="cart-empty"]').should('contain', 'Your cart is empty')
        cy.get('body').should('not.contain', 'Claw Hammer 16oz')

    })
})