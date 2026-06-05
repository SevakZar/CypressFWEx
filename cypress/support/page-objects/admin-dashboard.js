class AdminDashboard {

    // Brand
    static addBrand = '[data-testid="add-brand"]'
    static brandName = '[data-testid="brand-name"]'
    static submitBrand = '[data-testid="submit-brand"]'
    static brandRow = '[data-testid="brand-row"]'
    //static brandTable = '[data-testid="brands-table"]'

    //Product
    static addProduct = '[data-testid="add-product"]'
    static productName = '[data-testid="product-name"]'
    static productDescription = '[data-testid="product-description"]'
    static productPrice = '[data-testid="product-price"]'
    static productStock = '[data-testid="product-stock"]'
    static productCategory = '[data-testid="product-category"]'
    static productBrand = '[data-testid="product-brand"]'
    static submitProduct = '[data-testid="submit-product"]'
    static productRow = '[data-testid="product-row"]'
    static searchProducts = '[data-testid="search-products"]'

    //Order
    static inputSearchOrders = '[data-id="input-search-orders"]'
    static viewOrder = '[data-testid="view-order"]'
    static statusSelect = '[data-testid="status-select"]'
    static updateStatus = '[data-testid="update-status"]'
    static btnBackToOrders = '[data-id="btn-back-to-orders"]'
    static orderRow = '[data-testid="order-row"]'
    static orderStatus = '[data-id="order-status"]'

    //Users
    static email = '[data-testid="email"]'
    static enabled = '[data-testid="enabled"]'
    static submitUser = '[data-testid="submit-user"]'
    static searchUsers = '[data-testid="search-users"]'
    static editUser = '[data-testid="edit-user"]'
    static btnToggleUserStatus = '[data-id="btn-toggle-user-status"]'
}

export default AdminDashboard;