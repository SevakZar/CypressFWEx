/// <reference types="cypress" />

// Configurations
const baseUrl = Cypress.config('ApiBaseUrl')
const userKeyAdmin = 'admin'
const userKey = 'customer'

let accessToken
let userAddress
let addProduct
const newBrandName = "Question 14 Brand"
const existingProductId = "prod-9"
let paymentMehtod
let addProductToCart


describe('Typicode API Negative Tests', { tags: ['@api'] }, () => {
    context('Product Fetch test Q 18', () => {
        it('GET all products - Question 18', { tags: ['@smoke'] }, () => {
            const limit = 26
            cy.api({
                method: 'GET',
                url: `${baseUrl}/products?_sort=name&_order=asc&_page=1&_limit=${limit}`,
                body: {},
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                failOnStatusCode: false
            }).then(({ status, body }) => {
                expect(status).to.eq(200)
                expect(body.total).to.be.lessThan(limit) // it check all the products have been checked
                //cy.wrap(body.data).each((product, index) => {
                body.data.forEach((product, index) => {
                    //cy.step(`ASSERT : Product #${index + 1}: ${product.name}`)//I want a clean logging so i use Cypress.log to make all ASYNC
                    Cypress.log({
                        name: 'PRODUCT',
                        message: `${index + 1}: ${product.name}`
                    })
                    expect(product.id, 'product id').to.be.a('string').and.not.be.empty
                    expect(product.name, 'product name').to.be.a('string').and.not.be.empty
                    expect(product.price, 'product price').to.be.a('number')
                })
            })
        })
    })

    context('Logged In with Admin Tests Q 19 20 21 23', () => {
        before(() => {
            cy.loginAsAPI(userKeyAdmin).then((response) => {
                accessToken = 'Bearer ' + response.body.access_token
            })
            cy.fixture('addProduct').then((data) => {
                addProduct = data
            })
        })

        it('POST create product (Admin) - Question 19', () => {
            cy.api({
                method: 'POST',
                url: `${baseUrl}/products`,
                body: addProduct,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': accessToken
                },
                failOnStatusCode: false
            }).then((response) => {

                expect(response.status).to.eq(201)
                const newProductId = response.body.id
                const newProductName = response.body.name
                cy.api({
                    method: 'GET',
                    url: `${baseUrl}/products/${newProductId}`,
                    body: {},
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {

                    expect(response.status).to.eq(200)
                    expect(response.body.name).to.eq(newProductName)
                })
                cy.api({
                    method: 'DELETE',
                    url: `${baseUrl}/products/${newProductId}`,
                    body: {},
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {

                    expect(response.status).to.eq(204)
                })
            })
        })

        it('PUT update product (Admin) - Question 20', () => {
            const UpdateProduct = { price: 29.99 }
            cy.api({
                method: 'PUT',
                url: `${baseUrl}/products/${existingProductId}`,
                body: UpdateProduct,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': accessToken
                },
                failOnStatusCode: false
            }).then((response) => {

                expect(response.status).to.eq(200)
            })
            cy.api({
                method: 'GET',
                url: `${baseUrl}/products/${existingProductId}`,
                body: {},
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': accessToken
                },
                failOnStatusCode: false
            }).then((response) => {

                expect(response.status).to.eq(200)
                expect(response.body.price).to.eq(UpdateProduct.price)
            })
            cy.api({
                method: 'PUT',
                url: `${baseUrl}/products/${existingProductId}`,
                body: { price: 29.99 },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': accessToken
                },
                failOnStatusCode: false
            }).then((response) => {

                expect(response.status).to.eq(200)
            })
        })

        it('DELETE product (Admin) - Question 21', () => {
            cy.api({
                method: 'POST',
                url: `${baseUrl}/products`,
                body: addProduct,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': accessToken
                },
                failOnStatusCode: false
            }).then((response) => {

                expect(response.status).to.eq(201)
                const newProductForDeleteId = response.body.id
                cy.api({
                    method: 'DELETE',
                    url: `${baseUrl}/products/${newProductForDeleteId}`,
                    body: {},
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {

                    expect(response.status).to.eq(204)
                })
                cy.api({
                    method: 'GET',
                    url: `${baseUrl}/products/${newProductForDeleteId}`,
                    body: {},
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {

                    expect(response.status).to.eq(404)
                    expect(response.body.message).to.eq("Product not found")
                })
            })
        })

        it('POST create brand (Admin) - Question 23', () => {
            cy.api({
                method: 'POST',
                url: `${baseUrl}/brands`,
                body: { name: newBrandName },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': accessToken
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(201)
                const newBrandId = response.body.id
                const newBrandSlug = response.body.slug
                cy.api({
                    method: 'GET',
                    url: `${baseUrl}/brands`,
                    body: {},
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    const brand = response.body.find(
                        brand => brand.id === newBrandId
                    )
                    expect(brand).to.exist
                    expect(brand.id).to.exist
                    expect(brand.name).to.eq(newBrandName)
                    expect(brand.slug).to.eq(newBrandSlug)
                })
                cy.api({
                    method: 'Delete',
                    url: `${baseUrl}/brands/${newBrandId}`,
                    body: {},
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {

                    expect(response.status).to.eq(204)
                })
            })
        })

    })

    context('User Auth Tests Q 22', () => {

        it('POST user login - Question 22', () => {
            cy.loginAsAPI(userKey).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.user.id).to.exist
                expect(response.body.user.email).to.exist
                expect(response.body.user.email).to.eq('customer@automationcamp.org')
                expect(response.body.user.role).to.exist
            })
        })
    })

    context('Cart Tests Q 24', () => {

        it('POST create cart and add item - Question 24', () => {
            cy.api({
                method: 'POST',
                url: `${baseUrl}/carts`,
                body: {},
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(201)
                const newCartId = response.body.id
                cy.api({
                    method: 'POST',
                    url: `${baseUrl}/carts/${newCartId}`,
                    body: addProductToCart,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200)
                })
                cy.api({
                    method: 'GET',
                    url: `${baseUrl}/carts/${newCartId}`,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    const cartProductName = response.body.items.find(
                        cartProductName => cartProductName.product_id === addProductToCart.product_id
                    )
                    expect(cartProductName).to.exist
                    expect(cartProductName.quantity).to.eq(addProductToCart.quantity)
                })
            })
        })
    })

    context('Logged In with User Tests Q 25 26 27', () => {
        before(() => {
            cy.step("ARRANGE: Authenticate as customer")
            cy.loginAsAPI(userKey).then((response) => {
                accessToken = 'Bearer ' + response.body.access_token
                cy.api({
                    method: 'GET',
                    url: `${baseUrl}/users/me`,
                    body: {},
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    userAddress = response.body
                })
            })
            cy.fixture('paymentMehtod').then((data) => {
                paymentMehtod = data
            })
        })

        it('POST place order (authenticated) - Question 25', () => {
            cy.step("ACT: Create a cart with at least one item")
            cy.api({
                method: 'POST',
                url: `${baseUrl}/carts`,
                body: {},
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': accessToken
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(201)
                const newCartId = response.body.id
                cy.api({
                    method: 'POST',
                    url: `${baseUrl}/carts/${newCartId}`,
                    body: addProductToCart,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200)
                })
                cy.step("ACT: end POST to /api/invoices with cart_id, address, and payment details")
                cy.api({
                    method: 'POST',
                    url: `${baseUrl}/invoices`,
                    body: {
                        billing_address: userAddress.street,
                        billing_city: userAddress.city,
                        billing_country: userAddress.country,
                        billing_email: userAddress.email,
                        billing_first_name: userAddress.first_name,
                        billing_last_name: userAddress.last_name,
                        billing_postal_code: userAddress.postal_code,
                        billing_state: userAddress.state,
                        cart_id: newCartId,
                        paymentMehtod
                    },
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body.id).to.exist
                    expect(response.body.status).to.eq("AWAITING_FULFILLMENT")
                })
            })
        })

        it('POST place order (authenticated) - Question 26', () => {
            cy.step("ACT: Send POST to /api/favorites with product_id")
            cy.api({
                method: 'POST',
                url: `${baseUrl}/favorites`,
                body: { product_id: existingProductId },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': accessToken
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(201)
                const newFavID = response.body.id
                cy.step("ACT: GET /api/favorites and verify addition")
                cy.api({
                    method: 'GET',
                    url: `${baseUrl}/favorites`,
                    body: addProductToCart,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    const fav = response.body.find(
                        fav => fav.id === newFavID
                    )
                    expect(fav).to.exist
                    expect(fav.product_id).to.eq(existingProductId)
                })
                cy.step("ACT: Delete added Fav for test next run")
                cy.api({
                    method: 'DELETE',
                    url: `${baseUrl}/favorites/${newFavID}`,
                    body: {},
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': accessToken
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(204)
                })
            })
        })

        it('POST place order (authenticated) - Question 27', () => {
            cy.step("ACT: Send GET to /api/users/me without an Authorization header")
            cy.api({
                method: 'GET',
                url: `${baseUrl}/users/me`,
                body: {},
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body.message).to.eq("Access token is required")
            })
        })
    })











    // it('Should handle POST request with extremely large payload', () => {
    //     const largePost = {
    //         title: 'a'.repeat(10000),
    //         body: 'b'.repeat(100000),
    //         userId: 1
    //     }

    //     cy.api({
    //         method: 'POST',
    //         url: `${baseUrl}/posts`,
    //         body: largePost,
    //         headers: {
    //             'Content-type': 'application/json; charset=UTF-8'
    //         },
    //         failOnStatusCode: false
    //     }).then((response) => {
    //         expect([200, 201, 413]).to.include(response.status)
    //     })
    // })

    // it('Should handle POST with missing Content-Type header', () => {
    //     cy.api({
    //         method: 'POST',
    //         url: `${baseUrl}/posts`,
    //         body: {
    //             title: 'Test',
    //             body: 'Content',
    //             userId: 1
    //         },
    //         failOnStatusCode: false
    //     }).then((response) => {
    //         // Most APIs accept this, but it's a common error
    //         expect([200, 201, 415]).to.include(response.status)
    //     })
    // })

    // context('READ - Negative Tests', () => {

    //     it('Should return 404 for non-existent post ID', { tags: ['@smoke'] }, () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/posts/999999`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(404)
    //             expect(response.body).to.be.empty
    //         })
    //     })

    //     it('Should return 404 for invalid post ID (non-numeric)', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/posts/invalid-id`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(404)
    //         })
    //     })

    //     it('Should return 404 for negative post ID', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/posts/-1`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(404)
    //         })
    //     })

    //     it('Should return 404 for non-existent user', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/users/999`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(404)
    //         })
    //     })

    //     it('Should handle invalid query parameters gracefully', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/posts?userId=invalid`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(200)
    //             expect(response.body).to.be.an('array')
    //             expect(response.body).to.be.empty
    //         })
    //     })

    //     it('Should return 404 for non-existent nested resource', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/posts/999/comments`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(200)
    //             expect(response.body).to.be.an('array')
    //             expect(response.body).to.be.empty
    //         })
    //     })

    //     it('Should return 404 for invalid endpoint', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/nonexistent`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(404)
    //         })
    //     })

    //     it('Should handle malformed URL path', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/posts//1`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect([200, 404]).to.include(response.status)
    //         })
    //     })
    // })

    // context('UPDATE - Negative Tests', () => {

    //     it('Should fail to patch non-existent post', () => {
    //         cy.api({
    //             method: 'PATCH',
    //             url: `${baseUrl}/posts/999999`,
    //             body: {
    //                 title: 'Patched Title'
    //             },
    //             headers: {
    //                 'Content-type': 'application/json; charset=UTF-8'
    //             },
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect([200, 404]).to.include(response.status)
    //         })
    //     })

    //     it('Should handle PUT with empty body', () => {
    //         cy.api({
    //             method: 'PUT',
    //             url: `${baseUrl}/posts/1`,
    //             body: {},
    //             headers: {
    //                 'Content-type': 'application/json; charset=UTF-8'
    //             },
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(200)
    //         })
    //     })

    //     it('Should handle PATCH with invalid data types', () => {
    //         cy.api({
    //             method: 'PATCH',
    //             url: `${baseUrl}/posts/1`,
    //             body: {
    //                 title: 12345,
    //                 userId: 'not-a-number'
    //             },
    //             headers: {
    //                 'Content-type': 'application/json; charset=UTF-8'
    //             },
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(200)
    //         })
    //     })

    //     it('Should handle update with missing required fields', () => {
    //         cy.api({
    //             method: 'PUT',
    //             url: `${baseUrl}/posts/1`,
    //             body: {
    //                 title: 'Only Title'
    //                 // Missing body and userId
    //             },
    //             headers: {
    //                 'Content-type': 'application/json; charset=UTF-8'
    //             },
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(200)
    //         })
    //     })
    // })

    // context('DELETE - Negative Tests', () => {

    //     it('Should fail to delete non-existent post', { tags: ['@smoke'] }, () => {
    //         cy.api({
    //             method: 'DELETE',
    //             url: `${baseUrl}/posts/999999`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             // Typicode returns 200 even for non-existent resources
    //             expect([200, 404]).to.include(response.status)
    //         })
    //     })

    //     it('Should fail to delete with invalid post ID', () => {
    //         cy.api({
    //             method: 'DELETE',
    //             url: `${baseUrl}/posts/invalid`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect([200, 404]).to.include(response.status)
    //         })
    //     })

    //     it('Should handle delete with negative ID', () => {
    //         cy.api({
    //             method: 'DELETE',
    //             url: `${baseUrl}/posts/-1`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect([200, 404]).to.include(response.status)
    //         })
    //     })

    //     it('Should fail to delete from invalid endpoint', () => {
    //         cy.api({
    //             method: 'DELETE',
    //             url: `${baseUrl}/nonexistent/1`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(404)
    //         })
    //     })
    // })

    // context('Method Not Allowed Tests', () => {

    //     it('Should return error for unsupported DELETE on root posts endpoint', () => {
    //         cy.api({
    //             method: 'DELETE',
    //             url: `${baseUrl}/posts`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             // Typically 405 Method Not Allowed or 404
    //             expect([404, 405]).to.include(response.status)
    //         })
    //     })

    //     it('Should fail for PUT on collection endpoint', () => {
    //         cy.api({
    //             method: 'PUT',
    //             url: `${baseUrl}/posts`,
    //             body: { title: 'Test' },
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect([404, 405]).to.include(response.status)
    //         })
    //     })
    // })

    // context('Edge Cases and Boundary Tests', () => {

    //     it('Should handle zero as post ID', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/posts/0`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(404)
    //         })
    //     })

    //     it('Should handle very large post ID', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/posts/999999999999`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(404)
    //         })
    //     })

    //     it('Should handle special characters in query parameters', () => {
    //         cy.api({
    //             method: 'GET',
    //             url: `${baseUrl}/posts?title=<script>alert('xss')</script>`,
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(200)
    //             expect(response.body).to.be.an('array')
    //         })
    //     })

    //     it('Should handle null values in request body', () => {
    //         cy.api({
    //             method: 'POST',
    //             url: `${baseUrl}/posts`,
    //             body: {
    //                 title: null,
    //                 body: null,
    //                 userId: null
    //             },
    //             headers: {
    //                 'Content-type': 'application/json; charset=UTF-8'
    //             },
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect(response.status).to.eq(201)
    //         })
    //     })

    //     it('Should handle array instead of object in POST', () => {
    //         cy.api({
    //             method: 'POST',
    //             url: `${baseUrl}/posts`,
    //             body: ['invalid', 'array', 'data'],
    //             headers: {
    //                 'Content-type': 'application/json; charset=UTF-8'
    //             },
    //             failOnStatusCode: false
    //         }).then((response) => {
    //             expect([200, 201, 400]).to.include(response.status)
    //         })
    //     })
    // })
})