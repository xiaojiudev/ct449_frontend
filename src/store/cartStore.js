import { defineStore } from 'pinia';
import axios from 'axios';



export const useCartStore = defineStore('cart', {
    state: () => ({
        totalItemsInCart: 0,
        cartItems: [],
    }),
    actions: {
        async updateTotalItems(count) {
            this.totalItemsInCart = count;
        },
        async fetchTotalItemsInCart() {
            try {
                const cartResponse = await axios.get('http://localhost:8080/api/v1/carts', {
                    withCredentials: true
                });
                const cartItems = cartResponse.data.message.items;
                const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);
                this.totalItemsInCart = totalItemsInCart;
            } catch (error) {
                console.error('CartStore - Error fetching cart items:', error);
            }
        },
        async fetchUserCart() {
            try {
                const cartResponse = await axios.get('http://localhost:8080/api/v1/carts', {
                    withCredentials: true,
                });

                const cartItems = cartResponse.data.message.items.map((item) => ({
                    productName: item.product.name,
                    quantity: item.quantity,
                    totalPrice: item.price * item.quantity,
                    productImage: item.product.image,
                }));

                this.setCartItems(cartItems);
            } catch (error) {
                console.error('Error fetching user cart:', error);
            }
        },
        setCartItems(items) {
            this.cartItems = items;
        },
    }
})