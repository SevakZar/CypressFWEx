/// <reference types="cypress" />

// Page objects
import LoginPage from "../../support/page-objects/login-page"
import MainPage from "../../support/page-objects/main-page"

// Configurations
let email
let password
const userKey = 'customer' //LoginUserAS

before(() => {
    const user = Cypress.env('users')[userKey]
    email = user.email
    password = user.password
})

/**
 * Used Gherkin Syntax + cy.step() for better logs and more clear test steps
 */
describe('Authentication Tests', { tags: ['@ui'] }, () => {

    context("When user is logged out", () => {

        it('Should login with valid credentials - Question 1', { tags: ['@smoke', '@regression'] }, () => {
            cy.step("GIVEN I am on the home page")
            cy.visit('/')
            cy.get(LoginPage.loginNavButton).click()
            cy.step("WHEN I put valid credentials and click the Login button")
            cy.get(LoginPage.usernameInput).type(email)
            cy.get(LoginPage.passwordInput).type(password)
            cy.get(LoginPage.loginSubmitButton).click()
            cy.step("THEN I should login successfully")
            cy.get(MainPage.cartButton).should('be.visible')
        })

        it('Should not login with invalid credentials - Question 2', { tags: ['@regression'] }, () => {
            cy.step("GIVEN I am on the login page")
            cy.visit('/auth/login')
            cy.step("WHEN I put invalid credentials and click the Login button")
            cy.get(LoginPage.usernameInput).type("invalid_username@gmail.com")
            cy.get(LoginPage.passwordInput).type("invalid_password")
            cy.get(LoginPage.loginSubmitButton).click()
            cy.step("THEN I should see error message")
            cy.get(LoginPage.loginErrorMessage)
                .should('be.visible')
                .and('contain.text', 'Invalid credentials')
        })

        it('Should not login with empty credentials', { tags: ['@regression'] }, () => {
            cy.step("GIVEN I'm in Login page")
            cy.visit('/auth/login')
            cy.step("WHEN I click the login without putting credentials")
            cy.get(LoginPage.loginSubmitButton).click()
            cy.step("THEN I should see error message")
            cy.get(LoginPage.usernameInput)
                .then(($input) => {
                    expect($input[0].checkValidity()).to.be.false
                    expect($input[0].validationMessage)
                        .to.eq('Please fill out this field.')
                })
        })
    })

    context("When user is logged in", () => {
        beforeEach(() => {
            cy.step("GIVEN I'm logged in")
            cy.loginAs(userKey)
            cy.visit('/')
        })

        it('Should be able to logout', { tags: ['@regression'] }, () => {
            cy.step("WHEN I logout")
            cy.get(MainPage.userMenuButton).click()
            cy.get(MainPage.logoutButton).click()
            cy.step("THEN I should navigate to login page")
            cy.get(LoginPage.loginNavButton).should('be.visible')
        })
    })
    context("When want to register new user ", () => {
        const newRegisterPass = 'NewPass12345'
        const emailInput = "New1@automationcamp.org"

        it('Successful user registration - Question 3', { tags: ['@regression'] }, () => {
            cy.step("GIVEN I am on the home page")
            cy.visit('/')
            cy.step("WHEN I complete the registration fields")
            cy.get(LoginPage.registerNavButton).click()
            cy.step("THEN I complete registration fileds")
            cy.get(LoginPage.firstnameInput).type("Micheal")
            cy.get(LoginPage.lastnameInput).type("White")
            cy.get(LoginPage.emailInput).type(emailInput)
            cy.get(LoginPage.passwordInput).type(newRegisterPass)
            cy.get(LoginPage.passwordConfirmInput).type(newRegisterPass)
            cy.get(LoginPage.phoneInput).type("09101020304")
            cy.get(LoginPage.dobInput).type("2000-02-20")

            cy.step("WHEN I submit the registration form")
            cy.get(LoginPage.registerSubmitButton).click()

            cy.step("THEN I should see the user profile button")
            cy.get(MainPage.userButton).should('be.visible')
        })
        after('Delete New User', () => {
            cy.step("GIVEN I am logged in as admin")
            cy.loginAs('admin')

            cy.step("WHEN I navigate to users management page")
            cy.visit('/admin/users')

            cy.step("WHEN I delete the created user")
            cy.on('window:confirm', (text) => {
                expect(text).to.contains('Delete this user?')
                return true
            })
            cy.contains(emailInput).parent().within(() => {
                cy.get(LoginPage.deleteUser).click()
            })

            cy.step("THEN the user should no longer exist in the table")
            cy.contains(emailInput).should('not.exist')
            cy.get('table').should('not.contain', emailInput)
        })
    })
})