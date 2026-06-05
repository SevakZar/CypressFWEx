/// <reference types="cypress" />

// Page objects
import LoginPage from '../../support/page-objects/login-page'
import MainPage from '../../support/page-objects/main-page'
import AdminDashboard from '../../support/page-objects/admin-dashboard'

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
    cy.section('Test Setup')
    cy.step('ARRANGE: Login user and visit home page')
    cy.loginAs(userKey)
  })

  context('Brand in Admin - Q 14', () => {
    it('Add new brand - Question 14', { tags: ['@smoke', '@regression'] }, () => {
      cy.section('Test Body')

      cy.step('ACT: Navigate to /admin/brands')
      cy.visit('/admin/brands')

      cy.step('ACT: Click Add Brand')
      cy.get(AdminDashboard.addBrand).click()

      cy.step('ACT: Fill brand name')
      cy.get(AdminDashboard.brandName).type(newBrand)

      cy.step('ACT: Save')
      cy.get(AdminDashboard.submitBrand).click()

      cy.step('ACT: For loading was a little bit slow')
      cy.get(AdminDashboard.brandRow).eq(0).should('be.visible') //beacuse the service was slow in loading

      cy.step('ASSERT: New brand is created and appears in the brands list')
      cy.get('[data-testid="brands-table"]>tbody>tr>td:first-child').should('contain', newBrand)
    })

    after(() => {
      cy.section('Test Rollback Brand')
      cy.step('ACT: Navigate to /admin/brands')
      cy.visit('/admin/brands')

      cy.get(AdminDashboard.brandRow).eq(0).should('be.visible')

      cy.step('ACT: Delete inserted Brand')
      cy.window().then((win) => {
        win.confirm = (text) => {
          expect(text).to.contain('Delete this brand?')
          return true
        }
      })
      cy.step('ACT: Find the inserted Brand')
      cy.contains(newBrand)
        .parent()
        .within(() => {
          cy.get('button').contains('Delete').click()
        })
      cy.step('ASSERT: new product Deleted Successfully')
      cy.get('body').should('not.contain', newBrand)
    })
  })

  context('Product in Admin - Q 15', () => {
    it('Add new product - Question 15', { tags: ['@smoke', '@regression'] }, () => {
      cy.section('Test Body')

      cy.step('ACT: Navigate to /admin/products')
      cy.visit('/admin/products')

      cy.step('ACT: Click Add product')
      cy.get(AdminDashboard.addProduct).click()

      cy.step('ACT: Fill all required fields (name, description, price, stock, category, brand)')
      cy.get(AdminDashboard.productName).type(newProductName)
      cy.get(AdminDashboard.productDescription).type('For Question NUmber 15')
      cy.get(AdminDashboard.productPrice).type(20.02)
      cy.get(AdminDashboard.productStock).type(2)
      cy.get(AdminDashboard.productCategory).select('cat-3')
      cy.get(AdminDashboard.productBrand).select('ForgeFlex')

      cy.step('ACT: Save')
      cy.get(AdminDashboard.submitProduct).click()

      cy.step('ASSERT: As the for loading was a little bit slow')
      cy.get(AdminDashboard.productRow).eq(0).should('be.visible')

      cy.step('ASSERT: New product is created and appears in the products list')
      cy.get(AdminDashboard.searchProducts).type(`${newProductName}{enter}`)
      cy.contains(newProductName).should('be.visible')
    })

    after(() => {
      cy.section('Test Rollback product')
      cy.step('ACT: Navigate to /admin/products')
      cy.visit('/admin/products')

      cy.step('ASSERT: As the for loading was a little bit slow')
      cy.get(AdminDashboard.productRow).eq(0).should('be.visible')

      cy.step('ACT: Delete inserted Product')
      cy.window().then((win) => {
        win.confirm = (text) => {
          expect(text).to.contain('Delete this product?')
          return true
        }
      })
      cy.step('ACT: Find the inserted product')
      cy.get(AdminDashboard.searchProducts).type(`${newProductName}{enter}`)
      cy.get('button').contains('Delete').click()

      cy.step('ASSERT: new product Deleted Successfully')
      cy.get('body').should('not.contain', newProductName)
    })
  })

  context('Update Order in Admin - Q 16', () => {
    it('Update order status - Question 16', { tags: ['@smoke', '@regression'] }, () => {
      cy.section('Test Body')

      cy.step('ACT: Navigate to /admin/orders')
      cy.visit('/admin/orders')

      cy.step('ACT: Click on an order')
      cy.get(AdminDashboard.inputSearchOrders).type(`${invoiceNumber}{enter}`)
      cy.get(AdminDashboard.viewOrder).should('have.length', 1).click()

      cy.step('ACT: Change status to SHIPPED')
      cy.get(AdminDashboard.statusSelect).select('SHIPPED')

      cy.step('ACT: update-status AND Go back to form for assertion')
      cy.get(AdminDashboard.updateStatus).click()
      cy.get(AdminDashboard.btnBackToOrders).click()

      cy.step('ASSERT: As the for loading was a little bit slow')
      cy.get(AdminDashboard.orderRow).eq(0).should('be.visible')

      cy.step('ASSERT: New product is created and appears in the products list')
      cy.get(AdminDashboard.inputSearchOrders).type(`${invoiceNumber}{enter}`)
      cy.get(AdminDashboard.orderStatus).should('have.length', 1).and('have.text', 'SHIPPED')
    })
    after(() => {
      cy.section('Test Rollback Update order status')

      cy.step('ACT: Navigate to /admin/orders')
      cy.visit('/admin/orders')

      cy.step('ACT: Click on an order')
      cy.get(AdminDashboard.inputSearchOrders).type(`${invoiceNumber}{enter}`)
      cy.get(AdminDashboard.viewOrder).should('have.length', 1).click()

      cy.step('ACT: Change status to SHIPPED')
      cy.get(AdminDashboard.statusSelect).select('ON HOLD')

      cy.step('ACT: update-status AND Go back to form for assertion')
      cy.get(AdminDashboard.updateStatus).click()
      cy.get(AdminDashboard.btnBackToOrders).click()

      cy.step('ACT: As the for loading was a little bit slow')
      cy.get(AdminDashboard.orderRow).eq(0).should('be.visible')

      cy.step('ASSERT: New product is created and appears in the products list')
      cy.get(AdminDashboard.inputSearchOrders).type(`${invoiceNumber}{enter}`)
      cy.get(AdminDashboard.orderStatus).should('have.length', 1).and('have.text', 'ON HOLD')
    })
  })

  context('Disable User in Admin - Q 17', () => {
    it('Disable user account - Question 17', { tags: ['@smoke', '@regression'] }, () => {
      cy.section('Test Body')

      cy.step('ACT: Navigate to /admin/users')
      cy.visit('/admin/users')

      cy.step('ACT: Edit customer3@automationcamp.org')
      cy.contains(editUser).parent().find(AdminDashboard.editUser).click()
      cy.url().should('include', '/admin/users/edit/') //beacuse the service was slow in loading
      cy.get(AdminDashboard.email).should('have.value', editUser)

      cy.step('ACT: Set account to disabled')
      cy.get(AdminDashboard.enabled).uncheck()

      cy.step('ACT: Save')
      cy.get(AdminDashboard.submitUser).click()

      cy.step('ASSERT: User account is disabled')
      cy.get(AdminDashboard.searchUsers).type(`${editUser}{enter}`)
      cy.contains(editUser)
        .should('be.visible')
        .parent()
        .find(AdminDashboard.btnToggleUserStatus)
        .and('have.text', 'Disabled')

      cy.step('ACT: login attempt')
      cy.visit('/')
      cy.get(MainPage.userMenuButton).click()
      cy.get(MainPage.logoutButton).click()
      cy.visit('/auth/login')
      cy.get(LoginPage.usernameInput).type(email)
      cy.get(LoginPage.passwordInput).type(password)
      cy.get(LoginPage.loginSubmitButton).click()
      cy.step('ASSERT: login attempt shows an appropriate error or is rejected')
      cy.get(LoginPage.loginErrorMessage).should('be.visible').and('have.text', 'Your account has been disabled.')
    })
    after(() => {
      cy.section('Test Rollback Disable user account')
      cy.step('ARRANGE: Login user and visit home page')
      cy.loginAs(userKey)

      cy.step('ACT: Navigate to /admin/users')
      cy.visit('/admin/users')

      cy.step('ACT: Edit customer3@automationcamp.org')
      cy.contains(editUser).parent().find(AdminDashboard.editUser).click()
      cy.url().should('include', '/admin/users/edit/') //beacuse the service was slow in loading
      cy.get(AdminDashboard.email).should('have.value', editUser).and('be.visible')

      cy.step('ACT: Set account to Active')
      cy.get(AdminDashboard.enabled).check()

      cy.step('ACT: Save')
      cy.get(AdminDashboard.submitUser).click()

      cy.step('ASSERT: User account is Active')
      cy.get(AdminDashboard.searchUsers).type(`${editUser}{enter}`)
      cy.contains(editUser)
        .should('be.visible')
        .parent()
        .find(AdminDashboard.btnToggleUserStatus)
        .and('have.text', 'Active')
    })
  })
})
