class LoginPage {

    //Login
    static usernameInput = '[data-testid="email"]'
    static passwordInput = '[data-testid="password"]'
    static loginSubmitButton = '[data-testid="login-submit"]'
    static loginNavButton = '[data-testid="nav-login"]'
    static usernameErrorMessage = '[data-test="email-error"]'
    static passwordErrorMessage = '[data-test="password-error"]'
    static loginErrorMessage = '[data-testid="login-error"]'

    //Register
    static registerNavButton = '[data-testid="nav-register"]'
    static firstnameInput = '[data-testid="first-name"]'
    static lastnameInput = '[data-testid="last-name"]'
    static emailInput = '[data-testid="email"]' 
    static passwordInputRegister = '[data-testid="password"]' 
    static passwordConfirmInput = '[data-testid="password-confirm"]' 
    static phoneInput = '[data-testid="phone"]' 
    static dobInput = '[data-testid="dob"]' 
    static registerSubmitButton = '[data-testid="register-submit"]' 

    //Delete User
    static deleteUser = '[data-testid="delete-user"]'  
}

export default LoginPage;