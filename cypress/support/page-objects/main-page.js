class MainPage {
    // Header
    static userMenuButton = '[data-testid="nav-user-menu"]'
    static cartButton = '[data-testid="nav-cart"]'
    static searchQuery = '[data-testid="search-query"]'
    static searchButton = '[data-id="search-btn"]'
    static cartBadge = '[data-test="page-title"]'

    // Products
    static productCard = '[data-testid="product-card"]'
    static productName = '[data-testid="product-name"]'
    static itemPrice = '[data-testid="product-price"]'
    static productCategory = '[data-testid="product-category"]'
    //static addToCartButton = (name) => `[data-test="add-to-cart-sauce-labs-${name}"]`
    //static removeFromCartButton = (name) => `[data-test="remove-sauce-labs-${name}"]`

    // Menu button
    //static allItemsButton = "#inventory_sidebar_link"
    //static aboutButton = "#about_sidebar_link"

    static navProfile = '[data-testid="nav-profile"]'
    static navOrders = '[data-testid="nav-orders"]'
    static navAccountFavorites = '[data-id="nav-account-favorites"]'
    static navAccountMessages = '[data-id="nav-account-messages"]'

    static userButton = '[data-id="user-avatar"]'
    static logoutButton = '[data-testid="nav-logout"]'
    //static closeMenuButton = "#react-burger-cross-btn"


}

export default MainPage;