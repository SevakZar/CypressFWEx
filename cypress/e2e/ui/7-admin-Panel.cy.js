/// <reference types="cypress" />

// Page objects
import LoginPage from "../../support/page-objects/login-page"
import MainPage from "../../support/page-objects/main-page"

// Auth Configurations 
const userKey = 'admin' //LoginUserAS
const userKeyeditUser = 'customer3'
const user = Cypress.env('users')[userKeyeditUser]
let email = user.email
let password = user.password

// Test Configurations 
const newBrand = 'Question 14 Brand'
const newProductName = 'Question 15 Product'
const invoiceNumber = 'INV-2024-0003'
const editUser = 'customer3@automationcamp.org'

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

    it('Add new product - Question 15', { tags: ['@smoke', '@regression'] }, () => {

        cy.section("Test Body")

        cy.step("ACT: Navigate to /admin/products")
        cy.visit('/admin/products')

        cy.step("ACT: Click Add product")
        cy.get('[data-testid="add-product"]').click()

        cy.step("ACT: Fill all required fields (name, description, price, stock, category, brand)")
        cy.get('[data-testid="product-name"]').type(newProductName)
        cy.get('[data-testid="product-description"]').type("For Question NUmber 15")
        cy.get('[data-testid="product-price"]').type(20.02)
        cy.get('[data-testid="product-stock"]').type(2)
        cy.get('[data-testid="product-category"]').select('cat-3')
        cy.get('[data-testid="product-brand"]').select('ForgeFlex')


        cy.step("ACT: As the for loading was a little bit slow")
        cy.intercept('POST', '/api/products').as('productSave')
        cy.step("ACT: Save")
        cy.get('[data-testid="submit-product"]').click()
        cy.wait('@productSave').its('response.statusCode').should('eq', 201)

        cy.step("ASSERT: New product is created and appears in the products list")
        cy.get('[data-testid="search-products"]').type(`${newProductName}{enter}`)
        cy.contains(newProductName).should('be.visible')

    })

    it('Update order status - Question 16', { tags: ['@smoke', '@regression'] }, () => {

        cy.section("Test Body")

        cy.step("ACT: Navigate to /admin/orders")
        cy.visit('/admin/orders')

        cy.step("ACT: Click on an order")
        cy.contains(invoiceNumber).parent().find('[data-testid="view-order"]').click()

        cy.step("ACT: Change status to SHIPPED")
        cy.get('[data-testid="status-select"]').select('SHIPPED')

        cy.step("ACT: As the for loading was a little bit slow")
        cy.intercept('PUT', '/api/invoices/inv-3/status').as('updateInvoice')
        cy.step("ACT: update-status AND Go back to form for assertion")
        cy.get('[data-testid="update-status"]').click()
        cy.get('[data-id="btn-back-to-orders"]').click()
        cy.wait('@updateInvoice').its('response.statusCode').should('eq', 200)

        cy.step("ASSERT: New product is created and appears in the products list")
        cy.contains(invoiceNumber).parent().find('[data-id="order-status"]').should('have.text', 'SHIPPED')
    })

    it('Disable user account - Question 17', { tags: ['@smoke', '@regression'] }, () => {

        cy.section("Test Body")


        cy.step("ACT: Navigate to /admin/users")
        cy.visit('/admin/users')

        cy.step("ACT: Edit customer3@automationcamp.org")
        cy.contains(editUser).parent().find('[data-testid="edit-user"]').click()

        cy.step("ACT: Set account to disabled")
        cy.get('[data-testid="enabled"]').uncheck()

        cy.step("ACT: Save")
        cy.get('[data-testid="submit-user"]').click()

        cy.step("ASSERT: User account is disabled")
        cy.get('[data-testid="search-users"]').type(`${editUser}{enter}`)
        cy.contains(editUser).should('be.visible')
            .parent().find('[data-id="btn-toggle-user-status"]').and('have.text', 'Disabled')

        cy.step("ACT: login attempt")
        cy.visit('/')
        cy.get(MainPage.userMenuButton).click()
        cy.get(MainPage.logoutButton).click()
        cy.visit('/auth/login')
        cy.get(LoginPage.usernameInput).type(email)
        cy.get(LoginPage.passwordInput).type(password)
        cy.get(LoginPage.loginSubmitButton).click()
        cy.get('[data-testid="login-error"]').should('be.visible').and('have.text', 'Your account has been disabled.')


        //login attempt shows an appropriate error or is rejected

    })

    after(() => {
        cy.loginAs(userKey)

        cy.section("Test Rollback Brand")
        cy.step("ACT: Navigate to /admin/brands")
        cy.visit('/admin/brands')

        /*cy.intercept('GET', '/api/brands').as('brands')
        cy.wait('@brands').its('response.statusCode').should('eq', 304)*/

        cy.step("ACT: Delete inserted Brand")
        cy.window().then((win) => {
            win.confirm = ((text) => {
                expect(text).to.contain('Delete this brand?')
                return true
            })
        })
        cy.step("ACT: Find the inserted Brand")
        cy.contains(newBrand).parent().within(() => {
            cy.get('button').contains('Delete').click()
        })
        cy.step("ASSERT: new product Deleted Successfully")
        cy.get('body').should('not.contain', newBrand)

        ////////////////////////////////////////////////////////////////////////////////////////

        cy.section("Test Rollback product")
        cy.step("ACT: Navigate to /admin/products")
        cy.visit('/admin/products')

        // cy.intercept('GET', '/api/products?_page=1&_limit=10').as('product')
        // cy.wait('@product').its('response.statusCode').should('eq', 304)

        cy.step("ACT: Delete inserted Product")
        cy.window().then((win) => {
            win.confirm = ((text) => {
                expect(text).to.contain('Delete this product?')
                return true
            })
        })
        cy.step("ACT: Find the inserted product")
        cy.get('[data-testid="search-products"]').type(`${newProductName}{enter}`)
        cy.get('button').contains('Delete').click()


        cy.step("ASSERT: new product Deleted Successfully")
        cy.get('body').should('not.contain', newProductName)

        ////////////////////////////////////////////////////////////////////////////////////////

        cy.section("Test Rollback Update order status")

        cy.step("ACT: Navigate to /admin/orders")
        cy.visit('/admin/orders')

        cy.step("ACT: Click on an order")
        cy.contains(invoiceNumber).parent().find('[data-testid="view-order"]').click()

        cy.step("ACT: Change status to SHIPPED")
        cy.get('[data-testid="status-select"]').select('ON HOLD')

        cy.step("ACT: As the for loading was a little bit slow")
        cy.intercept('PUT', '/api/invoices/inv-3/status').as('updateInvoice')
        cy.step("ACT: update-status AND Go back to form for assertion")
        cy.get('[data-testid="update-status"]').click()
        cy.get('[data-id="btn-back-to-orders"]').click()
        cy.wait('@updateInvoice').its('response.statusCode').should('eq', 200)

        cy.step("ASSERT: New product is created and appears in the products list")
        cy.contains(invoiceNumber).parent().find('[data-id="order-status"]').should('have.text', 'ON HOLD')

        ////////////////////////////////////////////////////////////////////////////////////////
        cy.section("Test Rollback Disable user account")
        cy.step("ACT: Navigate to /admin/users")
        cy.visit('/admin/users')

        cy.step("ACT: Edit customer3@automationcamp.org")
        cy.contains(editUser).parent().find('[data-testid="edit-user"]').click()

        cy.step("ACT: Set account to disabled")
        cy.get('[data-testid="enabled"]').check()

        cy.step("ACT: Save")
        cy.get('[data-testid="submit-user"]').click()

        cy.step("ASSERT: User account is disabled")
        cy.get('[data-testid="search-users"]').type(`${editUser}{enter}`)
        cy.contains(editUser).should('be.visible')
            .parent().find('[data-id="btn-toggle-user-status"]').and('have.text', 'Active')

    })
})