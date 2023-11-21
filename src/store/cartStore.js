import { defineStore } from 'pinia';
import axios from 'axios';
import { message } from 'ant-design-vue';



export const useCartStore = defineStore('cart', {
    state: () => ({
        totalItemsInCart: Number(localStorage.getItem('totalItemsInCart')) || 0,
        cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
        totalPrice: Number(localStorage.getItem('totalPrice')) || 0.00,
    }),
    actions: {
        async updateTotalItems(count) {
            this.totalItemsInCart = count;
            localStorage.setItem('totalItemsInCart', JSON.stringify(count));
        },
        async fetchUserCartRequest() {
            try {
                const cartResponse = await axios.get('http://localhost:8080/api/v1/carts', {
                    withCredentials: true,
                });

                const cartItems = cartResponse.data.message.items.map((item) => ({
                    product: item.product,
                    name: item.name,
                    quantity: item.quantity,
                    maxQuantity: item.maxQuantity,
                    price: item.price,
                    subTotal: item.subTotal,
                    image: item.image,
                }));

                this.setCartItems(cartItems, cartItems.length, cartResponse.data.message.totalPrice);
            } catch (error) {
                console.error('Error fetching user cart:', error);
            }
        },
        async clearCartItemsRequest() {
            try {
                const res = await axios.delete('http://localhost:8080/api/v1/carts/clear', {
                    withCredentials: true
                })

                if (res.status === 200) {
                    clearCartItems()
                } else {
                    message.error('Delete cart items failed')
                }
            } catch (error) {
                console.log("Error when clearing cart items");
            }
        },
        async removeAnItemRequest(id) {
            try {
                const res = await axios.delete(`http://localhost:8080/api/v1/carts/${id}`,
                    {
                        withCredentials: true,
                    }
                );

                await this.fetchUserCartRequest()
            } catch (error) {
                throw new Error('Error when deleting product from cart');
            }
        },
        setCartItems(items, quantity, totalPrice) {
            this.cartItems = items;
            this.totalItemsInCart = quantity;
            this.totalPrice = totalPrice;
            localStorage.setItem('cartItems', JSON.stringify(items));
            localStorage.setItem('totalItemsInCart', JSON.stringify(quantity));
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
        },
        retrieveCartItems() {
            const storedCartItems = localStorage.getItem('cartItems');
            if (storedCartItems) {
                this.cartItems = JSON.parse(storedCartItems);
            }
        },
        clearCartItems() {
            this.cartItems = [];
            this.totalItemsInCart = 0;
            this.totalPrice = 0;
            localStorage.removeItem('cartItems');
            localStorage.removeItem('totalItemsInCart');
            localStorage.removeItem('totalPrice');
        },
        setTotalItemsInCart(value) {
            this.totalItemsInCart = value ?? 0;
        }
    }
})