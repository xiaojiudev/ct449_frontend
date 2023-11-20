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
            localStorage.setItem('totalItemsInCart', JSON.stringify(count));
        },
        async fetchUserCart() {
            try {
                const cartResponse = await axios.get('http://localhost:8080/api/v1/carts', {
                    withCredentials: true,
                });

                const cartItems = cartResponse.data.message.items.map((item) => ({
                    product: item.product,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    subTotal: item.subTotal,
                    image: item.image,
                }));

                this.setCartItems(cartItems);
            } catch (error) {
                console.error('Error fetching user cart:', error);
            }
        },
        setCartItems(items) {
            this.cartItems = items;
            localStorage.setItem('cartItems', JSON.stringify(items));
        },
        clearCartItems() {
            this.cartItems = [];
            localStorage.removeItem('cartItems');
            localStorage.removeItem('totalItemsInCart');
        },
        retrieveCartItems() {
            const storedCartItems = localStorage.getItem('cartItems');
            if (storedCartItems) {
                this.cartItems = JSON.parse(storedCartItems);
            }
        },
        setTotalItemsInCart(value) {
            this.totalItemsInCart = value ?? 0;
        }
    }
})