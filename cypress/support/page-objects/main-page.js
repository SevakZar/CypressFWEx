class MainPage {
    // Header
    static userMenuButton = '[data-testid="nav-user-menu"]'
    static cartButton = '[data-testid="nav-cart"]'
    static cartBadge = '[data-test="page-title"]'

    // Products
    static addToCartButton = (name) => `[data-test="add-to-cart-sauce-labs-${name}"]`
    static removeFromCartButton = (name) => `[data-test="remove-sauce-labs-${name}"]`
    static itemPrice = '[data-test="inventory-item-price"]'

    // Menu button
    static allItemsButton = "#inventory_sidebar_link"
    static aboutButton = "#about_sidebar_link"
    static logoutButton = '[data-testid="nav-logout"]'
    static closeMenuButton = "#react-burger-cross-btn"
    static userButton = '[data-id="user-avatar"]'

}

export default MainPage;